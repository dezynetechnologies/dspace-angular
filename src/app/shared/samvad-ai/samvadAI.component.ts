import { ChangeDetectionStrategy, EventEmitter, Inject, Input, Output, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import uniqueId from 'lodash/uniqueId';

import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { pushInOut } from '../animations/push';
import { HostWindowService } from '../host-window.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { hasValue, hasValueOperator, isEmpty, isNotEmpty } from '../empty.util';
import { RouteService } from '../../core/services/route.service';
import { SEARCH_CONFIG_SERVICE } from '../../my-dspace-page/my-dspace-page.component';
import { PaginatedSearchOptions } from './models/paginated-search-options.model';
import { SearchResult } from './models/search-result.model';
import { SamvadAIConfigurationService } from '../../core/shared/samvad-ai/samvad-ai-configuration.service';
import { SamvadAIService } from '../../core/shared/samvad-ai/samvad-ai.service';
import { currentPath } from '../utils/route.utils';
import { Context } from '../../core/shared/context.model';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { SearchConfig } from '../../core/shared/search/search-filters/search-config.model';
import { SearchConfigurationOption } from './samvadAI-switch-configuration/search-configuration-option.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { followLink } from '../utils/follow-link-config.model';
import { Item } from '../../core/shared/item.model';
import { SearchObjects } from './models/search-objects.model';
import { ViewMode } from '../../core/shared/view-mode.model';
import { SelectionConfig } from './samvadAI-results/search-results.component';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { CollectionElementLinkType } from '../object-collection/collection-element-link.type';
import { SubmissionObject } from '../../core/submission/models/submission-object.model';
import { SearchFilterConfig } from './models/search-filter-config.model';
import { WorkspaceItem } from '../../core/submission/models/workspaceitem.model';
import { ITEM_MODULE_PATH } from '../../item-page/item-page-routing-paths';
import { COLLECTION_MODULE_PATH } from '../../collection-page/collection-page-routing-paths';
import { COMMUNITY_MODULE_PATH } from '../../community-page/community-page-routing-paths';
import { AppConfig, APP_CONFIG } from '../../../config/app-config.interface';
import { Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { response } from 'express';
import { FormsModule } from '@angular/forms';
import { isNull } from 'lodash';

@Component({
  selector: 'ds-samvad-ai',
  styleUrls: ['./samvadAI.component.scss'],
  templateUrl: './samvadAI.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [pushInOut]
})

/**
 * This component renders a sidebar, a search input bar and the samvad-ai results.
 */
export class SamvadAIComponent{

  // /**
  //  * The list of available configuration options
  //  */
  // @Input() configurationList: SearchConfigurationOption[] = [];

  // /**
  //  * The current context
  //  * If empty, 'samvadAI' is used
  //  */
  // @Input() context: Context = Context.Search;

  // /**
  //  * The configuration to use for the samvadAI options
  //  * If empty, 'default' is used
  //  */
  // @Input() configuration;

  // /**
  //  * The actual query for the fixed filter.
  //  * If empty, the query will be determined by the route parameter called 'filter'
  //  */
  // @Input() fixedFilterQuery: string;

  // /**
  //  * If this is true, the request will only be sent if there's
  //  * no valid cached version. Defaults to true
  //  */
  // @Input() useCachedVersionIfAvailable = true;

  // /**
  //  * True when the samvadAI component should show results on the current page
  //  */
  // @Input() inPlaceSearch = true;

  // /**
  //  * The link type of the listed samvadAI results
  //  */
  // @Input() linkType: CollectionElementLinkType;

  // /**
  //  * The pagination id used in the samvad-ai
  //  */
  // @Input() paginationId = 'spc';

  // /**
  //  * Whether or not the samvad-ai bar should be visible
  //  */
  // @Input() samvadAIEnabled = true;

  // /**
  //  * The width of the sidebar (bootstrap columns)
  //  */
  // @Input() sideBarWidth = 3;

  // /**
  //  * The placeholder of the samvad-ai form input
  //  */
  // @Input() samvadAIFormPlaceholder = 'search.search-form.placeholder';

  // /**
  //  * A boolean representing if result entries are selectable
  //  */
  // @Input() selectable = false;

  // /**
  //  * The config option used for selection functionality
  //  */
  // @Input() selectionConfig: SelectionConfig;

  // /**
  //  * A boolean representing if show csv export button
  //  */
  // @Input() showCsvExport = false;

  // /**
  //  * A boolean representing if show samvad-ai sidebar button
  //  */
  // @Input() showSidebar = true;

  // /**
  //  * Whether to show the thumbnail preview
  //  */
  // @Input() showThumbnails;

  // /**
  //  * Whether to show the view mode switch
  //  */
  // @Input() showViewModes = true;

  // /**
  //  * List of available view mode
  //  */
  // @Input() useUniquePageId: boolean;

  // /**
  //  * List of available view mode
  //  */
  // @Input() viewModeList: ViewMode[];

  // /**
  //  * Defines whether or not to show the scope selector
  //  */
  // @Input() showScopeSelector = true;

  // /**
  //  * Whether or not to track samvad-ai statistics by sending updates to the rest api
  //  */
  // @Input() trackStatistics = false;

  // /**
  //  * The default value for the samvad-ai query when none is already defined in the {@link SearchConfigurationService}
  //  */
  // @Input() query: string;

  // /**
  //  * The fallback scope when no scope is defined in the url, if this is also undefined no scope will be set
  //  */
  // @Input() scope: string;

  // /**
  //  * The current configuration used during the samvad-ai
  //  */
  // currentConfiguration$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  // /**
  //  * The current context used during the samvad-ai
  //  */
  // currentContext$: BehaviorSubject<Context> = new BehaviorSubject<Context>(null);

  // /**
  //  * The current sort options used
  //  */
  // currentScope$: Observable<string>;

  // /**
  //  * The current sort options used
  //  */
  // currentSortOptions$: BehaviorSubject<SortOptions> = new BehaviorSubject<SortOptions>(null);

  // /**
  //  * An observable containing configuration about which filters are shown and how they are shown
  //  */
  // filtersRD$: BehaviorSubject<RemoteData<SearchFilterConfig[]>> = new BehaviorSubject<RemoteData<SearchFilterConfig[]>>(null);

  // /**
  //  * Maintains the last samvadAI options, so it can be used in refresh
  //  */
  // lastSamvadAIOptions: PaginatedSearchOptions;

  // /**
  //  * The current search results
  //  */
  // resultsRD$: BehaviorSubject<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> = new BehaviorSubject(null);

  // /**
  //  * The current paginated samvadAI options
  //  */
  // samvadAIOptions$: BehaviorSubject<PaginatedSearchOptions> = new BehaviorSubject<PaginatedSearchOptions>(null);

  // /**
  //  * The available sort options list
  //  */
  // sortOptionsList$: BehaviorSubject<SortOptions[]> = new BehaviorSubject<SortOptions[]>([]);

  // /**
  //  * TRUE if the samvadAI option are initialized
  //  */
  // initialized$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // /**
  //  * Observable for whether or not the sidebar is currently collapsed
  //  */
  // isSidebarCollapsed$: Observable<boolean>;

  // /**
  //  * Emits true if were on a small screen
  //  */
  // isXsOrSm$: Observable<boolean>;

  // /**
  //  * Emits when the samvadAI filters values may be stale, and so they must be refreshed.
  //  */
  // refreshFilters: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // /**
  //  * Link to the samvad-ai page
  //  */
  // samvadAILink: string;

  // /**
  //  * Regex to match UUIDs
  //  */
  // uuidRegex = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/g;

  // /**
  //  * List of paths that are considered to be the start of a route to an object page (excluding "/", e.g. "items")
  //  * These are expected to end on an object UUID
  //  * If they match the route we're navigating to, an object property will be added to the search event sent
  //  */
  // allowedObjectPaths: string[] = ['entities', ITEM_MODULE_PATH, COLLECTION_MODULE_PATH, COMMUNITY_MODULE_PATH];

  // /**
  //  * Subscriptions to unsubscribe from
  //  */
  // subs: Subscription[] = [];

  // /**
  //  * Emits an event with the current search result entries
  //  */
  // @Output() resultFound: EventEmitter<SearchObjects<DSpaceObject>> = new EventEmitter<SearchObjects<DSpaceObject>>();

  // /**
  //  * Emits event when the user deselect result entry
  //  */
  // @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  // /**
  //  * Emits event when the user select result entry
  //  */
  // @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  // constructor(//protected service: SamvadAIService,
  //             protected sidebarService: SidebarService,
  //             protected windowService: HostWindowService,
  //             //@Inject(SEARCH_CONFIG_SERVICE) public samvadAIConfigService: SamvadAIConfigurationService,
  //             protected routeService: RouteService,
  //             protected router: Router,
  //             @Inject(APP_CONFIG) protected appConfig: AppConfig,
  // ) {
  //   this.isXsOrSm$ = this.windowService.isXsOrSm();
  // }

  // /**
  //  * Listening to changes in the paginated samvad AI options
  //  * If something changes, update the search results
  //  *
  //  * Listen to changes in the scope
  //  * If something changes, update the list of scopes for the dropdown
  //  */
  // ngOnInit(): void {
  //   if (this.useUniquePageId) {
  //     // Create an unique pagination id related to the instance of the SamvadAIComponent
  //     this.paginationId = uniqueId(this.paginationId);
  //   }

  //   //this.samvadAIConfigService.setPaginationId(this.paginationId);

  //   if (hasValue(this.configuration)) {
  //     this.routeService.setParameter('configuration', this.configuration);
  //   }
  //   if (hasValue(this.fixedFilterQuery)) {
  //     this.routeService.setParameter('fixedFilterQuery', this.fixedFilterQuery);
  //   }

  //   this.currentScope$ = this.routeService.getQueryParameterValue('scope').pipe(
  //     map((routeValue: string) => hasValue(routeValue) ? routeValue : this.scope),
  //   );

  //   //this.isSidebarCollapsed$ = this.isSidebarCollapsed();
  //   //this.samvadAILink = this.getSamvadAILink();
  //   this.currentContext$.next(this.context);

  //   // Determinate PaginatedSamvadAIOptions and listen to any update on it
  //   //const configuration$: Observable<string> = this.samvadAIConfigService
  //   //  .getCurrentConfiguration(this.configuration).pipe(distinctUntilChanged());
  //   //const samvadAISortOptions$: Observable<SortOptions[]> = combineLatest([configuration$, this.currentScope$]).pipe(
  //   //  switchMap(([configuration, scope]: [string, string]) => this.samvadAIConfigService.getConfigurationSamvadAIConfig(configuration, scope)),
  //   //  map((samvadAIConfig: SearchConfig) => this.samvadAIConfigService.getConfigurationSortOptions(samvadAIConfig)),
  //   //  distinctUntilChanged()
  //   //);
  //   //const sortOption$: Observable<SortOptions> = samvadAISortOptions$.pipe(
  //   //  switchMap((samvadAISortOptions: SortOptions[]) => {
  //   //    const defaultSort: SortOptions = samvadAISortOptions[0];
  //   //    return this.samvadAIConfigService.getCurrentSort(this.paginationId, defaultSort);
  //   //  }),
  //   //  distinctUntilChanged()
  //   //);
  //   //const samvadAIOptions$: Observable<PaginatedSearchOptions> = this.getSamvadAIOptions().pipe(distinctUntilChanged());

  //   //this.subs.push(combineLatest([configuration$, samvadAISortOptions$, samvadAIOptions$, sortOption$, this.currentScope$]).pipe(
  //   //  filter(([configuration, samvadAISortOptions, samvadAIOptions, sortOption, scope]: [string, SortOptions[], PaginatedSearchOptions, SortOptions, string]) => {
  //       // filter for samvadAI options related to instanced paginated id
  //   //    return samvadAIOptions.pagination.id === this.paginationId;
  //   //  }),
  //   //  debounceTime(100)
  //   //).subscribe(([configuration, samvadAISortOptions, samvadAIOptions, sortOption, scope]: [string, SortOptions[], PaginatedSearchOptions, SortOptions, string]) => {
  //     // Build the PaginatedSamvadAIOptions object
  //     //const combinedOptions = Object.assign({}, samvadAIOptions,
  //       //{
  //         //configuration: samvadAIOptions.configuration || configuration,
  //         //sort: sortOption || samvadAIOptions.sort
  //       //});
  //     //if (combinedOptions.query === '') {
  //     //  combinedOptions.query = this.query;
  //     //}
  //     //if (isEmpty(combinedOptions.scope)) {
  //      // combinedOptions.scope = scope;
  //     //}
  //     //const newSamvadAIOptions = new PaginatedSearchOptions(combinedOptions);
  //     // check if samvadAI options are changed
  //     // if so retrieve new related results otherwise skip it
  //     //if (JSON.stringify(newSamvadAIOptions) !== JSON.stringify(this.samvadAIOptions$.value)) {
  //       // Initialize variables
  //     //  this.currentConfiguration$.next(configuration);
  //     //  this.currentSortOptions$.next(newSamvadAIOptions.sort);
  //     //  this.sortOptionsList$.next(samvadAISortOptions);
  //     //  this.samvadAIOptions$.next(newSamvadAIOptions);
  //       this.initialized$.next(true);
  //       // retrieve results
  //     //  this.retrieveSamvadAIResults(newSamvadAIOptions);
  //     //  this.retrieveFilters(newSamvadAIOptions);
  //     }
  //   }//));

  //   //this.subscribeToRoutingEvents();
  // //}

  // /**
  //  * Change the current context
  //  * @param context
  //  */
  // // public changeContext(context: Context) {
  // //   this.currentContext$.next(context);
  // // }

  // /**
  //  * Set the sidebar to a collapsed state
  //  */
  // // public closeSidebar(): void {
  // //   this.sidebarService.collapse();
  // // }

  // /**
  //  * Reset result list on view mode change
  //  */
  // // public changeViewMode() {
  // //   this.resultsRD$.next(null);
  // // }

  // /**
  //  * Set the sidebar to an expanded state
  //  */
  // // public openSidebar(): void {
  // //   this.sidebarService.expand();
  // // }

  // /**
  //  * Emit event to refresh filter content
  //  * @param $event
  //  */
  // // public onContentChange($event: any) {
  // //   this.retrieveFilters(this.lastSamvadAIOptions);
  // //   this.refreshFilters.next(true);
  // // }

  // /**
  //  * Unsubscribe from the subscriptions
  //  */
  // // ngOnDestroy(): void {
  // //   this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  // // }

  // /**
  //  * Get the current paginated samvadAI options
  //  * @returns {Observable<PaginatedSearchOptions>}
  //  */
  // // protected getSamvadAIOptions(): Observable<PaginatedSearchOptions> {
  // //   return this.samvadAIConfigService.paginatedSamvadAIOptions;
  // // }

  // /**
  //  * Retrieve samvadAI filters by the given samvadAI options
  //  * @param samvadAIOptions
  //  * @private
  //  */
  // // private retrieveFilters(samvadAIOptions: PaginatedSearchOptions) {
  // //   this.filtersRD$.next(null);
  // //   this.samvadAIConfigService.getConfig(samvadAIOptions.scope, samvadAIOptions.configuration).pipe(
  // //     getFirstCompletedRemoteData(),
  // //   ).subscribe((filtersRD: RemoteData<SearchFilterConfig[]>) => {
  // //     this.filtersRD$.next(filtersRD);
  // //   });
  // // }

  // /**
  //  * Retrieve samvadAI result by the given samvadAI options
  //  * @param samvadAIOptions
  //  * @private
  //  */
  // // private retrieveSamvadAIResults(samvadAIOptions: PaginatedSearchOptions) {
  // //   this.resultsRD$.next(null);
  // //   this.lastSamvadAIOptions = samvadAIOptions;
  // //   let followLinks = [
  // //     followLink<Item>('thumbnail', { isOptional: true }),
  // //     followLink<SubmissionObject>('item', { isOptional: true }, followLink<Item>('thumbnail', { isOptional: true })) as any,
  // //   ];
  // //   if (this.appConfig.item.showAccessStatuses) {
  // //     followLinks.push(followLink<Item>('accessStatus', { isOptional: true }));
  // //   }
  // //   if (this.configuration === 'supervision') {
  // //     followLinks.push(followLink<WorkspaceItem>('supervisionOrders', { isOptional: true }) as any);
  // //   }
  // //   this.service.search(
  // //     samvadAIOptions,
  // //     undefined,
  // //     this.useCachedVersionIfAvailable,
  // //     true,
  // //     ...followLinks
  // //     ).pipe(getFirstCompletedRemoteData())
  // //     .subscribe((results: RemoteData<SearchObjects<DSpaceObject>>) => {
  // //       if (results.hasSucceeded) {
  // //         if (this.trackStatistics) {
  // //           this.service.trackSearch(samvadAIOptions, results.payload);
  // //         }
  // //         if (results.payload?.page?.length > 0) {
  // //           this.resultFound.emit(results.payload);
  // //         }
  // //       }
  // //       this.resultsRD$.next(results);
  // //     });
  // // }

  // /**
  //  * Subscribe to routing events to detect when a user moves away from the samvadAI page
  //  * When the user is routing to an object page, it needs to send out a separate search event containing that object's UUID
  //  * This method should only be called once and is essentially what SamvadAITrackingComponent used to do (now removed)
  //  * @private
  //  */
  // // private subscribeToRoutingEvents() {
  // //   this.subs.push(
  // //     this.router.events.pipe(
  // //       filter((event) => event instanceof NavigationStart),
  // //       map((event: NavigationStart) => this.getDsoUUIDFromUrl(event.url)),
  // //       hasValueOperator(),
  // //     ).subscribe((uuid) => {
  // //       if (this.resultsRD$.value.hasSucceeded) {
  // //         this.service.trackSearch(this.samvadAIOptions$.value, this.resultsRD$.value.payload as SearchObjects<DSpaceObject>, uuid);
  // //       }
  // //     }),
  // //   );
  // // }

  // /**
  //  * Get the UUID from a DSO url
  //  * Return null if the url isn't an object page (allowedObjectPaths) or the UUID couldn't be found
  //  * @param url
  //  */
  // // private getDsoUUIDFromUrl(url: string): string {
  // //   if (isNotEmpty(url)) {
  // //     if (this.allowedObjectPaths.some((path) => url.startsWith(`/${path}`))) {
  // //       const uuid = url.substring(url.lastIndexOf('/') + 1);
  // //       if (uuid.match(this.uuidRegex)) {
  // //         return uuid;
  // //       }
  // //     }
  // //   }
  // //   return null;
  // // }

  // /**
  //  * Check if the sidebar is collapsed
  //  * @returns {Observable<boolean>} emits true if the sidebar is currently collapsed, false if it is expanded
  //  */
  // // private isSidebarCollapsed(): Observable<boolean> {
  // //   return this.sidebarService.isCollapsed;
  // // }

  // /**
  //  * @returns {string} The base path to the samvadAI page, or the current page when inPlaceSearch is true
  //  */
  // // private getSamvadAILink(): string {
  // //   if (this.inPlaceSearch) {
  // //     return currentPath(this.router);
  // //   }
  // //   return this.service.getSamvadAILink();
  // // }
  
  
  // @Inject(SamvadAIService)protected service:SamvadAIService;


  constructor(public service: SamvadAIService) {}
  @ViewChild('userInput') userInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('chatBox') chatBoxRef!: ElementRef<HTMLDivElement>;
  @ViewChild('attachmentDisp') attachDisplay!: ElementRef<HTMLDivElement>;
  selectedFile: File | null = null;
  fileQuery: string = '';

  sendMessage(): void {
    const userInput = this.userInputRef.nativeElement;
    const chatBox = this.chatBoxRef.nativeElement;
    if(!this.selectedFile){
      if (userInput.value.trim() !== '') {
        // Create user message
        const userMessage = document.createElement('div');
        userMessage.classList.add("message") 
        userMessage.classList.add("user-message");
        userMessage.textContent = userInput.value;
        chatBox.appendChild(userMessage);

        // Clear the input
        userInput.value = '';

        // Generate bot response
        const botMessage = document.createElement('div');
        botMessage.className = "message bot-message";
        
        this.service.uploadFile(this.selectedFile,userInput.value).subscribe(response => botMessage.textContent = response.message);
        chatBox.appendChild(botMessage);

        // Scroll to the bottom
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }
    else{
      if (userInput.value.trim() !== '') {
        const userMessage = document.createElement('div');
        userMessage.classList.add("message") 
        userMessage.classList.add("user-message");
        userMessage.textContent = userInput.value;
        
        const pdfIcon = document.createElement('img');
        pdfIcon.src = '../../../assets/images/pdf.png'; // Path to your PDF icon image
        pdfIcon.alt = 'PDF icon';
        pdfIcon.width = 20;
        chatBox.appendChild(pdfIcon);
        const fileName = document.createElement('span');
        fileName.textContent = ` ${this.selectedFile.name}`;
        chatBox.appendChild(fileName);
        chatBox.appendChild(userMessage);

        // Generate bot response
        const botMessage = document.createElement('div');
        botMessage.className = "message bot-message";
        
        this.service.uploadFile(this.selectedFile,userInput.value).subscribe(response => botMessage.textContent = response.message);
        chatBox.appendChild(botMessage);
        const at = this.attachDisplay.nativeElement;
        this.selectedFile = null;
        at.textContent = "";
        // Scroll to the bottom
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }
  }
  
  onAttachmentClick():void{
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];
        this.displaySelectedFile();
      }
    };
    fileInput.click();
  }

  displaySelectedFile(): void {
    const at = this.attachDisplay.nativeElement;

    if (this.selectedFile) {
      const pdfIcon = document.createElement('img');
      pdfIcon.src = '../../../assets/images/pdf.png'; // Path to your PDF icon image
      pdfIcon.alt = 'PDF icon';
      pdfIcon.width = 20;
      at.appendChild(pdfIcon);
      const fileName = document.createElement('span');
      fileName.textContent = ` ${this.selectedFile.name}`;
      at.appendChild(fileName);
      
      // Generate bot response
      // const botMessage = document.createElement('div');
      // botMessage.className = 'message bot-message';
      // this.service.uploadFile(this.selectedFile,this.fileQuery).subscribe(response => botMessage.textContent = response.message);
      // chatBox.appendChild(botMessage);
    }
  }

  onMicrophoneClick():void{}

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }
}
