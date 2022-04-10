import {Directive, HostListener, Input} from '@angular/core';
import {DomController} from '@ionic/angular';

@Directive({
    selector: '[bepingFadeHeader]'
})
export class FadeHeaderDirective {

    @Input() toolbar: any;
    private toolbarHeight = 44;

    constructor(
        private readonly domCtrl: DomController
    ) {
        console.log(this.toolbar);
    }

    @HostListener('ionScroll', ['$event']) onContentScroll(event) {
        let scrollTop: number = event.detail.scrollTop;
        if (scrollTop >= 255) {
            scrollTop = 255;
        }
        const hexDist = scrollTop.toString(16);
        this.domCtrl.write(() => {
            const color = getComputedStyle(this.toolbar.el).getPropertyValue('--ion-toolbar-background');
            this.toolbar.el.style.setProperty('--background', `${color}${hexDist}`);
        });
    }


}
