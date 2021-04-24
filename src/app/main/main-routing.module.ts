import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeywordsComponent } from './keywords/keywords.component';
import { MainComponent } from './main/main.component';
import { ResearchersComponent } from './researchers/researchers.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'researchers'
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'researchers',
        component: ResearchersComponent,
      },
      {
        path: 'keywords',
        component: KeywordsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
