import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export interface SelectOption {
    labelKey: string;
    value: string;
}

@Component({
    selector: 'beping-selection-ion-list',
    templateUrl: './selection-ion-list.component.html',
    styleUrls: ['./selection-ion-list.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: SelectionIonListComponent,
            multi: true
        }
    ]
})
export class SelectionIonListComponent implements ControlValueAccessor {

    @Input() options: SelectOption[];
    value: string[] = [];
    enabled = true;

    onChange: (v) => void;
    onTouch: () => void;

    constructor(
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {

    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.enabled = !isDisabled;
    }

    writeValue(obj: any): void {
        console.log('set value', obj);
        this.value = obj;
    }

    toggleItem(value: string) {
        if (this.value.includes(value)) {
            console.log('remove ', value);
            this.value = this.value.filter((v) => v !== value);
        } else {
            this.value.push(value);
        }
        this.changeDetectorRef.detectChanges();
        this.onChange?.(this.value);
        this.onTouch?.();
    }
}
