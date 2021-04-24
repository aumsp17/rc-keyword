import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  activeLink = 'researchers'

  links: { title: string, path: string }[] = [
    {
      title: 'Researchers',
      path: 'researchers'
    },
    {
      title: 'Keywords',
      path: 'keywords'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
