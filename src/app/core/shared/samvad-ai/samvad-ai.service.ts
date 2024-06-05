/* eslint-disable max-classes-per-file */
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { map, switchMap, take } from 'rxjs/operators';
import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { ResponseParsingService } from '../../data/parsing.service';
import { RemoteData } from '../../data/remote-data';
import { GetRequest,PostRequest } from '../../data/request.models';
import { RequestService } from '../../data/request.service';
import { DSpaceObject } from '../dspace-object.model';
import { GenericConstructor } from '../generic-constructor';
import { HALEndpointService } from '../hal-endpoint.service';
import { URLCombiner } from '../../url-combiner/url-combiner';
import { hasValue, hasValueOperator, isNotEmpty } from '../../../shared/empty.util';
import { SearchFilterConfig } from '../../../shared/samvad-ai/models/search-filter-config.model';
import { SearchResponseParsingService } from '../../data/search-response-parsing.service';
import { SearchObjects } from '../../../shared/samvad-ai/models/search-objects.model';
import { FacetValueResponseParsingService } from '../../data/facet-value-response-parsing.service';
import { PaginatedSearchOptions } from '../../../shared/samvad-ai/models/paginated-search-options.model';
import { ViewMode } from '../view-mode.model';
import { DSpaceObjectDataService } from '../../data/dspace-object-data.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../operators';
import { RouteService } from '../../services/route.service';
import { SearchResult } from '../../../shared/samvad-ai/models/search-result.model';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { getSearchResultFor } from '../../../shared/samvad-ai/samvadAI-result-element-decorator';
import { FacetValues } from '../../../shared/search/models/facet-values.model';
import { PaginationService } from '../../pagination/pagination.service';
import { SamvadAIConfigurationService } from './samvad-ai-configuration.service';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { RestRequest } from '../../data/rest-request.model';
import { BaseDataService } from '../../data/base/base-data.service';
import { Angulartics2 } from 'angulartics2';
import { SamvadAIComponent } from 'src/app/shared/samvad-ai/samvadAI.component';
import { HttpClient } from '@angular/common/http';

/**
 * A limited data service implementation for the 'discover' endpoint
 * - Overrides {@link BaseDataService.addEmbedParams} in order to make it public
 *
 * Doesn't use any of the service's dependencies, they are initialized as undefined
 * Therefore, equest/response handling methods won't work even though they're defined
 */
// class SamvadAIDataService extends BaseDataService<any> {
//   constructor() {
//     super('discover', undefined, undefined, undefined, undefined);
//   }

//   /**
//    * Adds the embed options to the link for the request
//    * @param href            The href the params are to be added to
//    * @param args            params for the query string
//    * @param linksToFollow   links we want to embed in query string if shouldEmbed is true
//    */
//   public addEmbedParams(href: string, args: string[], ...linksToFollow: FollowLinkConfig<any>[]) {
//     return super.addEmbedParams(href, args, ...linksToFollow);
//   }
// }

/**
 * Service that performs all general actions that have to do with the samvad-ai page
 */

interface DummyResponse {
  message: string;
}

@Injectable()
export class SamvadAIService{
  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/server/api/samvad-ai';
  chat(value: string): Observable<DummyResponse> {
    return this.http.post<DummyResponse>(this.apiUrl,{});
  }
}
  // /**
  //  * Endpoint link path for retrieving general samvad-ai results
  //  */
  // private samvadAILinkPath = 'discover/samvad-ai/objects';

  // /**
  //  * The ResponseParsingService constructor name
  //  */
  // private parser: GenericConstructor<ResponseParsingService> = SearchResponseParsingService;

  // /**
  //  * The RestRequest constructor name
  //  */
  // private request: GenericConstructor<RestRequest> = GetRequest;

  // /**
  //  * Subscription to unsubscribe from
  //  */
  // private sub;

  // /**
  //  * Instance of SamvadAIDataService to forward data service methods to
  //  */
  // private samvadAIDataService: SamvadAIDataService;

  // // constructor(
  // //   private routeService: RouteService,
  // //   protected requestService: RequestService,
  // //   private rdb: RemoteDataBuildService,
  // //   private halService: HALEndpointService,
  // //   private dspaceObjectService: DSpaceObjectDataService,
  // //   private paginationService: PaginationService,
  // //   private samvadAIConfigurationService: SamvadAIConfigurationService,
  // //   private angulartics2: Angulartics2,
  // // ) {
  // //   this.samvadAIDataService = new SamvadAIDataService();
  // // }

  // /**
  //  * Method to set service options
  //  * @param {GenericConstructor<ResponseParsingService>} parser The ResponseParsingService constructor name
  //  * @param {boolean} request The RestRequest constructor name
  //  */
  // setServiceOptions(parser: GenericConstructor<ResponseParsingService>, request: GenericConstructor<RestRequest>) {
  //   if (parser) {
  //     this.parser = parser;
  //   }
  //   if (request) {
  //     this.request = request;
  //   }
  // }

  // // getEndpoint(samvadAIOptions?: PaginatedSearchOptions): Observable<string> {
  // //   return this.halService.getEndpoint(this.samvadAILinkPath).pipe(
  // //     map((url: string) => {
  // //       if (hasValue(samvadAIOptions)) {
  // //         return (samvadAIOptions as PaginatedSearchOptions).toRestUrl(url);
  // //       } else {
  // //         return url;
  // //       }
  // //     })
  // //   );
  // // }

  // // /**
  // //  * Method to retrieve a paginated list of samvad AI results from the server
  // //  * @param {PaginatedSearchOptions} samvadAIOptions The configuration necessary to perform this search
  // //  * @param responseMsToLive The amount of milliseconds for the response to live in cache
  // //  * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
  // //  * no valid cached version. Defaults to true
  // //  * @param reRequestOnStale Whether or not the request should automatically be re-requested after
  // //  * the response becomes stale
  // //  * @param linksToFollow List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
  // //  * @returns {Observable<RemoteData<SearchObjects<T>>>} Emits a paginated list with all search results found
  // //  */
  // // search<T extends DSpaceObject>(samvadAIOptions?: PaginatedSearchOptions, responseMsToLive?: number, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<SearchObjects<T>>> {
  // //   const href$ = this.getEndpoint(samvadAIOptions);

  // //   href$.pipe(
  // //     take(1),
  // //     map((href: string) => {
  // //       const args = this.samvadAIDataService.addEmbedParams(href, [], ...linksToFollow);
  // //       if (isNotEmpty(args)) {
  // //         return new URLCombiner(href, `?${args.join('&')}`).toString();
  // //       } else {
  // //         return href;
  // //       }
  // //     })
  // //   ).subscribe((url: string) => {
  // //     const request = new this.request(this.requestService.generateRequestId(), url);

  // //     const getResponseParserFn: () => GenericConstructor<ResponseParsingService> = () => {
  // //       return this.parser;
  // //     };

  // //     Object.assign(request, {
  // //       responseMsToLive: hasValue(responseMsToLive) ? responseMsToLive : request.responseMsToLive,
  // //       getResponseParser: getResponseParserFn,
  // //       samvadAIOptions: samvadAIOptions
  // //     });

  // //     this.requestService.send(request, useCachedVersionIfAvailable);
  // //   });

  // //   const sqr$ = href$.pipe(
  // //     switchMap((href: string) => this.rdb.buildFromHref<SearchObjects<T>>(href))
  // //   );

  // //   return this.directlyAttachIndexableObjects(sqr$, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  // // }

  // // /**
  // //  * Method to retrieve request entries for samvad-ai results from the server
  // //  * @param {PaginatedSearchOptions} samvadAIOptions The configuration necessary to perform this search
  // //  * @returns {Observable<RemoteData<SearchObjects<T>>>} Emits a paginated list with all search results found
  // //  */
  // // samvadAIEntries<T extends DSpaceObject>(samvadAIOptions?: PaginatedSearchOptions): Observable<RemoteData<SearchObjects<T>>> {
  // //   const href$ = this.getEndpoint(samvadAIOptions);

  // //   const sqr$ = href$.pipe(
  // //     switchMap((href: string) => this.rdb.buildFromHref<SearchObjects<T>>(href))
  // //   );

  // //   return this.directlyAttachIndexableObjects(sqr$);
  // // }

  // // /**
  // //  * Method to directly attach the indexableObjects to samvadAI results, instead of using RemoteData.
  // //  * For compatibility with the way the samvadAI was written originally
  // //  *
  // //  * @param sqr$:                       a SamvadAIObjects RemotaData Observable without its
  // //  *                                    indexableObjects attached
  // //  * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
  // //  *                                    no valid cached version. Defaults to true
  // //  * @param reRequestOnStale            Whether or not the request should automatically be re-
  // //  *                                    requested after the response becomes stale
  // //  * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
  // //  *                                    {@link HALLink}s should be automatically resolved
  // //  * @protected
  // //  */
  // // protected directlyAttachIndexableObjects<T extends DSpaceObject>(sqr$: Observable<RemoteData<SearchObjects<T>>>, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<SearchObjects<T>>> {
  // //   return sqr$.pipe(
  // //     switchMap((resultsRd: RemoteData<SearchObjects<T>>) => {
  // //       if (hasValue(resultsRd.payload) && isNotEmpty(resultsRd.payload.page)) {
  // //         // retrieve the indexableObjects for all samvadAI results on the page
  // //         const samvadAIResult$Array: Observable<SearchResult<T>>[] = resultsRd.payload.page.map((result: SearchResult<T>) =>
  // //           this.dspaceObjectService.findByHref(result._links.indexableObject.href, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow as any).pipe(
  // //             getFirstCompletedRemoteData(),
  // //             getRemoteDataPayload(),
  // //             hasValueOperator(),
  // //             map((indexableObject: DSpaceObject) => {
  // //               // determine the constructor of the samvadAI result (ItemSearchResult,
  // //               // CollectionSearchResult, etc) based on the kind of the indeaxbleObject it
  // //               // contains. Recreate the result with that constructor
  // //               const constructor: GenericConstructor<ListableObject> = indexableObject.constructor as GenericConstructor<ListableObject>;
  // //               const resultConstructor = getSearchResultFor(constructor);

  // //               // Attach the payload directly to the indexableObject property on the result
  // //               return Object.assign(new resultConstructor(), result, {
  // //                 indexableObject
  // //               }) as SearchResult<T>;
  // //             }),
  // //           )
  // //         );

  // //         // Swap the original page in the remoteData with the new one, now that the results have the
  // //         // correct types, and all indexableObjects are directly attached.
  // //         return observableCombineLatest(samvadAIResult$Array).pipe(
  // //           map((page: SearchResult<T>[]) => {

  // //             const payload = Object.assign(new SearchObjects(), resultsRd.payload, {
  // //               page
  // //             }) as SearchObjects<T>;

  // //             return new RemoteData(
  // //               resultsRd.timeCompleted,
  // //               resultsRd.msToLive,
  // //               resultsRd.lastUpdated,
  // //               resultsRd.state,
  // //               resultsRd.errorMessage,
  // //               payload,
  // //               resultsRd.statusCode,
  // //             );
  // //           })
  // //         );
  // //       }
  // //       // If we don't have a payload, or the page is empty, simply pass on the unmodified
  // //       // RemoteData object
  // //       return [resultsRd];
  // //     })
  // //   );
  // // }


  // // /**
  // //  * Method to request a single page of filter values for a given value
  // //  * @param {SearchFilterConfig} filterConfig The filter config for which we want to request filter values
  // //  * @param {number} valuePage The page number of the filter values
  // //  * @param {SearchOptions} samvadAIOptions The samvad-ai configuration for the current samvad-ai
  // //  * @param {string} filterQuery The optional query used to filter out filter values
  // //  * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
  // //  *                                    no valid cached version. Defaults to true
  // //  * @returns {Observable<RemoteData<PaginatedList<FacetValue>>>} Emits the given page of facet values
  // //  */
  // // getFacetValuesFor(filterConfig: SearchFilterConfig, valuePage: number, samvadAIOptions?: PaginatedSearchOptions, filterQuery?: string, useCachedVersionIfAvailable = true): Observable<RemoteData<FacetValues>> {
  // //   let href;
  // //   let args: string[] = [];
  // //   if (hasValue(filterQuery)) {
  // //     args.push(`prefix=${encodeURIComponent(filterQuery)}`);
  // //   }
  // //   if (hasValue(samvadAIOptions)) {
  // //     samvadAIOptions = Object.assign(new PaginatedSearchOptions({}), samvadAIOptions, {
  // //       pagination: Object.assign({}, samvadAIOptions.pagination, {
  // //         currentPage: valuePage,
  // //         pageSize: filterConfig.pageSize
  // //       })
  // //     });
  // //     href = samvadAIOptions.toRestUrl(filterConfig._links.self.href, args);
  // //   } else {
  // //     args = [`page=${valuePage - 1}`, `size=${filterConfig.pageSize}`, ...args];
  // //     href = new URLCombiner(filterConfig._links.self.href, `?${args.join('&')}`).toString();
  // //   }

  // //   let request = new this.request(this.requestService.generateRequestId(), href);
  // //   request = Object.assign(request, {
  // //     getResponseParser(): GenericConstructor<ResponseParsingService> {
  // //       return FacetValueResponseParsingService;
  // //     }
  // //   });
  // //   this.requestService.send(request, useCachedVersionIfAvailable);

  // //   return this.rdb.buildFromHref(href);
  // // }

  // // /**
  // //  * Requests the current view mode based on the current URL
  // //  * @returns {Observable<ViewMode>} The current view mode
  // //  */
  // // getViewMode(): Observable<ViewMode> {
  // //   return this.routeService.getQueryParamMap().pipe(map((params) => {
  // //     if (isNotEmpty(params.get('view')) && hasValue(params.get('view'))) {
  // //       return params.get('view');
  // //     } else {
  // //       return ViewMode.ListElement;
  // //     }
  // //   }));
  // // }

  // // /**
  // //  * Changes the current view mode in the current URL
  // //  * @param {ViewMode} viewMode Mode to switch to
  // //  * @param {string[]} samvadAILinkParts
  // //  */
  // // setViewMode(viewMode: ViewMode, samvadAILinkParts?: string[]) {
  // //   this.paginationService.getCurrentPagination(this.samvadAIConfigurationService.paginationID, new PaginationComponentOptions()).pipe(take(1))
  // //     .subscribe((config) => {
  // //       let pageParams = { page: 1 };
  // //       const queryParams = { view: viewMode };
  // //       if (viewMode === ViewMode.DetailedListElement) {
  // //         pageParams = Object.assign(pageParams, { pageSize: 1 });
  // //       } else if (config.pageSize === 1) {
  // //         pageParams = Object.assign(pageParams, { pageSize: 10 });
  // //       }
  // //       this.paginationService.updateRouteWithUrl(this.samvadAIConfigurationService.paginationID, hasValue(samvadAILinkParts) ? samvadAILinkParts : [this.getSamvadAILink()], pageParams, queryParams);
  // //     });
  // // }

  // // /**
  // //  * Send samvad-ai event to rest api using angularitics
  // //  * @param config              Paginated samvadAI options used
  // //  * @param samvadAIQueryResponse The response objects of the performed search
  // //  * @param clickedObject       Optional UUID of an object a search was performed and clicked for
  // //  */
  // // trackSearch(config: PaginatedSearchOptions, samvadAIQueryResponse: SearchObjects<DSpaceObject>, clickedObject?: string) {
  // //   const filters: { filter: string, operator: string, value: string, label: string; }[] = [];
  // //   const appliedFilters = samvadAIQueryResponse.appliedFilters || [];
  // //   for (let i = 0, filtersLength = appliedFilters.length; i < filtersLength; i++) {
  // //     const appliedFilter = appliedFilters[i];
  // //     filters.push(appliedFilter);
  // //   }
  // //   this.angulartics2.eventTrack.next({
  // //     action: 'samvad-ai',
  // //     properties: {
  // //       searchOptions: config,
  // //       page: {
  // //         size: config.pagination.size, // same as samvadAIQueryResponse.page.elementsPerPage
  // //         totalElements: samvadAIQueryResponse.pageInfo.totalElements,
  // //         totalPages: samvadAIQueryResponse.pageInfo.totalPages,
  // //         number: config.pagination.currentPage, // same as samvadAIQueryResponse.page.currentPage
  // //       },
  // //       sort: {
  // //         by: config.sort.field,
  // //         order: config.sort.direction
  // //       },
  // //       filters: filters,
  // //       clickedObject,
  // //     },
  // //   });
  // // }

  // /**
  //  * @returns {string} The base path to the samvad-ai page
  //  */
  // getSamvadAILink(): string {
  //   return '/samvad-ai';
  // }

  // /**
  //  * Unsubscribe from the subscription
  //  */
  // ngOnDestroy(): void {
  //   if (this.sub !== undefined) {
  //     this.sub.unsubscribe();
  //   }
  // }
//}
