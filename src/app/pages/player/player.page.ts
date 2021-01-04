import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'beping-player',
    templateUrl: './player.page.html',
    styleUrls: ['./player.page.scss']
})
export class PlayerPage implements OnInit {

    constructor(
        private readonly router: Router,
        private readonly route: ActivatedRoute
    ) {
    }

    ngOnInit() {
    }

    navigateToClub() {
        const url = this.router.url.split('/');
        const newUrl = url.slice(0, 3);
        console.log(newUrl, url);

        this.router.navigate([`${newUrl.join('/')}/club/${Math.floor(Math.random() * 50)}`]);
    }

}
