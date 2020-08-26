import { Component, OnInit } from '@angular/core';
import { ArrSplitPipe } from './../../share/arr-split.pipe';

@Component({
	selector: 'app-billboard',
	templateUrl: './billboard.component.html',
	styleUrls: ['./billboard.component.css'],
	providers: [ArrSplitPipe]
})
export class BillboardComponent implements OnInit {
	serverResponse: any;
	constructor(private arrSplit: ArrSplitPipe) {}

	ngOnInit(): void {
		this.serverResponse = [
			{
				movie_id: '420817',
				img_src: 'trnyoKkkvvjZvRvCMrNDtSf25nH.jpg',
				title: 'Aladdín',
				location_list: [
					{
						id: 1,
						name: 'Alajuela'
					},
					{
						id: 2,
						name: 'Cartago'
					},
					{
						id: 3,
						name: 'Heredia'
					}
				]
			},
			{
				movie_id: '150540',
				img_src: 'sG3bHZWCMOZwhUq71WbPG9Vrrwc.jpg',
				title: 'Intensa Mente',
				location_list: [
					{
						id: 1,
						name: 'Alajuela'
					},
					{
						id: 2,
						name: 'Cartago'
					}
				]
			},
			{
				movie_id: '475557',
				img_src: 'v0eQLbzT6sWelfApuYsEkYpzufl.jpg',
				title: 'Guasón',
				location_list: [
					{
						id: 1,
						name: 'Alajuela'
					},
					{
						id: 3,
						name: 'Heredia'
					}
				]
			}
		];
	}
}
