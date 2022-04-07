import { Component, AfterViewInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements AfterViewInit {
  options: any = {
    autoHide: false,
    classNames: {
      content: "custombar-content",
      scrollContent: "simplebar-scroll-content",
      scrollbar: "simplebar-scrollbar",
      track: "simplebar-track"
    }
  };

  ngAfterViewInit() {}
}
