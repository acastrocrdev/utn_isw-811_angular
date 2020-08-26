import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './contact/contact.component';
import { PetFriendlyComponent } from './pet-friendly/pet-friendly.component';
import { RatingComponent } from './rating/rating.component';

import { ArrSplitPipe } from './arr-split.pipe';
import { FileSizePipe } from './file-size.pipe';
import { CapitalizePipe } from './capitalize.pipe';
import { OrderByPipe } from './order-by.pipe';
import { FilterPipe } from './filter.pipe';
import { CustomCurrencyPipe } from './custom-currency.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [ContactComponent, PetFriendlyComponent, RatingComponent, ArrSplitPipe, CapitalizePipe, FileSizePipe, FilterPipe, OrderByPipe, CustomCurrencyPipe],
	exports: [ContactComponent, PetFriendlyComponent, RatingComponent, ArrSplitPipe, CapitalizePipe, FileSizePipe, FilterPipe, OrderByPipe, CustomCurrencyPipe],
	imports: [CommonModule, FormsModule]
})
export class ShareModule {}
