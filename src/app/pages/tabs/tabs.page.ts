import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {addIcons} from 'ionicons';
import {apps, flash} from "ionicons/icons";
import {IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs} from "@ionic/angular/standalone";

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.page.html',
    styleUrls: ['./tabs.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonIcon, IonTabButton, IonLabel, IonTabBar, IonTabs]
})
export class TabsPage implements OnInit {

    constructor() {
        addIcons({flash, apps});
    }

    ngOnInit() {
    }

}
