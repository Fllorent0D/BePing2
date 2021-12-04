import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {SuperTabs} from '@ionic-super-tabs/angular';

@Component({
    selector: 'beping-abstract-page-tab',
    template: '<h1>test</h1>'
})
export class AbstractPageTabsComponent {

    @ViewChild('superTabs') public slides: SuperTabs;
    tabIndex = 0;

    constructor(protected changeDetectionRef: ChangeDetectorRef) {
    }

    focusSegment(segmentId) {
        document.getElementById(`segment-${segmentId}`).scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }

    selectTab(index) {
        if (index === this.tabIndex) {
            return;
        }
        this.focusSegment(index);
        this.slides.selectTab(index);
    }
}
