import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { KeywordService } from 'src/app/core/keyword.service';
import { Keyword } from 'src/app/shared/keyword';

@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.scss']
})
export class KeywordsComponent implements OnInit, AfterViewInit, OnDestroy {
  
  private destroy$: ReplaySubject<boolean> = new ReplaySubject(1);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  keywords$: Observable<(Keyword & { $id: string })[]>;
  dataSource: MatTableDataSource<Keyword & { $id: string }> = new MatTableDataSource();

  constructor(
    private keywordService: KeywordService
  ) {}
  
  ngOnInit(): void {
    this.keywords$ = this.keywordService.keywords$
  }

  ngAfterViewInit(): void {
    this.keywords$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(keywords => {
      this.dataSource.data = keywords;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = this.dataSourcePredicate;
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  dataSourcePredicate(data: Keyword, filter: string): boolean {
    let searchTerms = JSON.parse(filter);
    return ((searchTerms.keyword ? data.keyword.toLowerCase().indexOf(searchTerms.keyword.toLowerCase()) !== -1 : true))
  }
}
