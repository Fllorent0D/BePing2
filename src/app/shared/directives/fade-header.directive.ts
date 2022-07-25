import {Directive, HostListener, Input} from '@angular/core';
import {DomController} from '@ionic/angular';

@Directive({
    selector: '[bepingFadeHeader]'
})
export class FadeHeaderDirective {

    @Input() toolbar: any;

    constructor(
        private readonly domCtrl: DomController
    ) {
        console.log(this.toolbar);
    }

    @HostListener('ionScroll', ['$event']) onContentScroll(event) {
        // Defining the scroll distance at which the background should be fully opaque
        const scrollDist = 255;

        let scrollTop: number = event.detail.scrollTop;
        if (scrollTop >= scrollDist) {
            scrollTop = scrollDist;
        }
        // const hexDist = scrollTop.toString(16);
        this.domCtrl.write(() => {
            const color = getComputedStyle(this.toolbar.el).getPropertyValue('--ion-toolbar-background');
            // Unfortunately, not all browsers/devices currently support hex color with transparancy
            // So it's best to work with rgba instead of hexadecimal
            // this.toolbar.el.style.setProperty('--background', `${color}${hexDist}`);
            const [r, g, b] = this.hexToRgb(color);
            const opacity = (scrollTop / scrollDist).toFixed(2);
            const rgba = `rgba(${r},${g},${b},${opacity})`;
            this.toolbar.el.style.setProperty('--background', rgba);
        });
    }

    // Converts a hexadecimal color to rgb
    // Found on: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    private hexToRgb(hex: string): number[] {
        hex = hex.trim();
        hex = hex.startsWith('#') ? hex.substring(1) : hex;
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r, g, b];
    }
}
