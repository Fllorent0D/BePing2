import {ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {SwiperComponent} from 'swiper/angular';
import Swiper, {SwiperOptions} from 'swiper';
import {ViewDidEnter, ViewDidLeave} from '@ionic/angular';

export class AbstractPageTabsComponent implements ViewDidEnter, ViewDidLeave {

    @ViewChild('swiper', {static: false}) swiper?: SwiperComponent;
    @ViewChild('scrollbar') scrollbar?: ElementRef;
    activeSwiperIndex = 0;
    randomId = Math.round(Math.random() * 100);
    swiperConfig: SwiperOptions = {
        speed: 150,
        effect: 'cube',
        scrollbar: {
            draggable: true,
            hide: false,
            dragClass: 'beping-swiper-scrollbar-drag',
            el: '.beping-swiper-scrollbar'
        },
    };

    constructor(
        protected changeDetectionRef: ChangeDetectorRef,
        protected ngZone: NgZone
    ) {
    }

    slideChange([swiper]: [Swiper]) {
        this.ngZone.run(() => this.activeSwiperIndex = swiper.activeIndex);
    }

    selectTab(index) {
        this.swiper.swiperRef.slideTo(index);
    }

    ionViewDidEnter(): void {
        this.swiper.updateSwiper({});
        this.selectTab(this.activeSwiperIndex);
    }

    ionViewDidLeave(): void {
        this.swiper.swiperRef.scrollbar.destroy();
    }
}
