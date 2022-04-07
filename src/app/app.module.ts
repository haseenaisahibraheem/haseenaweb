import { BrowserModule } from "@angular/platform-browser";

import { NgModule } from "@angular/core";
import { SimplebarAngularModule } from "simplebar-angular";
import { NgxImagesloadedModule } from "ngx-imagesloaded";
import { AppComponent } from "./app.component";
import { NgTouchDirective, NgMouseWheelDirective } from "./directives";

import {
  RevealSlideShowComponent,
  SlideShowService
} from "./components/reveal-slideshow";

@NgModule({
  declarations: [
    AppComponent,
    RevealSlideShowComponent,
    NgTouchDirective,
    NgMouseWheelDirective
  ],
  imports: [BrowserModule, SimplebarAngularModule, NgxImagesloadedModule],
  bootstrap: [AppComponent],
  providers: [SlideShowService]
})
export class AppModule {}
