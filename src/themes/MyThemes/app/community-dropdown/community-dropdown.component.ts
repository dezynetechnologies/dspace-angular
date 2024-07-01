import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CommunityListService } from 'src/app/community-list-page/community-list-service';
import { CommunityListDatasource } from 'src/app/community-list-page/community-list-datasource';
import { FindListOptions } from 'src/app/core/data/find-list-options.model';
import { SortDirection } from 'src/app/core/cache/models/sort-options.model';
import { SortOptions } from 'src/app/core/cache/models/sort-options.model';
import { FlatNode } from 'src/app/community-list-page/flat-node.model';
import { CollectionViewer, SelectionModel } from '@angular/cdk/collections';
import { isEmpty } from 'src/app/shared/empty.util';
import { FlatTreeControl } from '@angular/cdk/tree';
import { DSONameService } from 'src/app/core/breadcrumbs/dso-name.service';

import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'ds-community-dropdown',
  templateUrl: './community-dropdown.component.html',
  styleUrls: ['./community-dropdown.component.scss']
})
export class CommunityDropdownComponent implements OnInit, OnDestroy{

  private expandedNodes: FlatNode[] = [];
  public loadingNode: FlatNode;

  @Output() newItemEvent = new EventEmitter<FlatNode>();

  treeControl = new FlatTreeControl<FlatNode>(
    (node: FlatNode) => node.level, (node: FlatNode) => true
  );
  dataSource: CommunityListDatasource;
  paginationConfig: FindListOptions;
  trackBy = (index, node: FlatNode) => node.id;

  constructor(
    protected communityListService: CommunityListService,
    public dsoNameService: DSONameService,
    private renderer: Renderer2
  ) {
    this.paginationConfig = new FindListOptions();
    this.paginationConfig.elementsPerPage = 2;
    this.paginationConfig.currentPage = 1;
    this.paginationConfig.sort = new SortOptions('dc.title', SortDirection.ASC);
  }

  ngOnInit() {
    this.dataSource = new CommunityListDatasource(this.communityListService);
    this.communityListService.getLoadingNodeFromStore().pipe(take(1)).subscribe((result) => {
      this.loadingNode = result;
    });
    this.communityListService.getExpandedNodesFromStore().pipe(take(1)).subscribe((result) => {
      this.expandedNodes = [...result];
      this.dataSource.loadCommunities(this.paginationConfig, this.expandedNodes);
    });
  }

  ngOnDestroy(): void {
    this.communityListService.saveCommunityListStateToStore(this.expandedNodes, this.loadingNode);
  }

  hasChild(_: number, node: FlatNode) {
    return node.isExpandable$;
  }

  /**
   * Whether this is a show more node that contains no data, but indicates that there is
   * one or more community or collection.
   * @param _
   * @param node
   */
  isShowMore(_: number, node: FlatNode) {
    return node.isShowMoreNode;
  }

  /**
   * Toggles the expanded variable of a node, adds it to the expanded nodes list and reloads the tree
   * so this node is expanded
   * @param node  Node we want to expand
   */
  toggleExpanded(node: FlatNode) {
    this.loadingNode = node;
    if (node.isExpanded) {
      this.expandedNodes = this.expandedNodes.filter((node2) => node2.id !== node.id);
      node.isExpanded = false;
    } else {
      this.expandedNodes.push(node);
      node.isExpanded = true;
      if (isEmpty(node.currentCollectionPage)) {
        node.currentCollectionPage = 1;
      }
      if (isEmpty(node.currentCommunityPage)) {
        node.currentCommunityPage = 1;
      }
    }
    this.dataSource.loadCommunities(this.paginationConfig, this.expandedNodes);
  }

  /**
   * Makes sure the next page of a node is added to the tree (top community, sub community of collection)
   *      > Finds its parent (if not top community) and increases its corresponding collection/subcommunity
   *      currentPage
   *      > Reloads tree with new page added to corresponding top community lis, sub community list or
   *      collection list
   * @param node  The show more node indicating whether it's an increase in top communities, sub communities
   *              or collections
   */
  getNextPage(node: FlatNode): void {
    this.loadingNode = node;
    if (node.parent != null) {
      if (node.id.startsWith('collection')) {
        const parentNodeInExpandedNodes = this.expandedNodes.find((node2: FlatNode) => node.parent.id === node2.id);
        parentNodeInExpandedNodes.currentCollectionPage++;
      }
      if (node.id.startsWith('community')) {
        const parentNodeInExpandedNodes = this.expandedNodes.find((node2: FlatNode) => node.parent.id === node2.id);
        parentNodeInExpandedNodes.currentCommunityPage++;
      }
    } else {
      this.paginationConfig.currentPage++;
    }
    this.dataSource.loadCommunities(this.paginationConfig, this.expandedNodes);
  }

  isToggled = {};
  Select1(node: any, element: ElementRef): void {
    const nodeId = node.id;

    // Toggle the state
    if (this.isToggled[nodeId]) {
      this.renderer.removeStyle(element, 'background-color');
    } else {
      this.renderer.setStyle(element, 'background-color', "cyan");
    }

    this.isToggled[nodeId] = !this.isToggled[nodeId];

    this.newItemEvent.emit(node);
    console.log(node);
  }

  // // Initialize a selection model to keep track of selected nodes
  // selection = new SelectionModel<any>(true, []);

  // // Method to check if a node is selected
  // isSelected(node: any): boolean {
  //   return this.selection.isSelected(node);
  // }

  // // Method to handle selection of a node
  // selectNode(node: any): void {
  //   this.selection.toggle(node); // Toggle selection (select/deselect)
  // }
}
