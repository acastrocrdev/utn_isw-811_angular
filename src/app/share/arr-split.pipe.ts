import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'arrSplit'
})
export class ArrSplitPipe implements PipeTransform {
	transform(arr: [], chunkSize: number) {
		if (typeof arr != 'undefined') {
			return arr.reduce((prev, cur, index) => (index % chunkSize ? prev : prev.concat([arr.slice(index, index + chunkSize)])), []);
		}
		return [];
	}
}
