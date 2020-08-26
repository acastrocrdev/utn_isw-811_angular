import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filter'
})
export class FilterPipe implements PipeTransform {
	transform(items: any[], text: string, prop: string): any[] {
		if (typeof prop == 'undefined' || prop == '') {
			if (!items) return [];
			if (!text) return items;
			return items.filter((singleItem) => singleItem[prop].toLowerCase().startsWith(text.toLowerCase()));
		} else {
			if (!items) {
				return [];
			}

			if (!text) {
				return items;
			}

			text = text.toLowerCase();
			return items.filter((it) => {
				return it.toLowerCase().includes(text);
			});
		}
	}
}
