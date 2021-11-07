import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ComponentRef, PopoverOptions} from '@ionic/core';

@Component({
    selector: 'beping-week-selector',
    templateUrl: './week-selector.component.html',
    styleUrls: ['./week-selector.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => WeekSelectorComponent),
            multi: true
        },
    ]
})
export class WeekSelectorComponent implements ControlValueAccessor {
    opts: PopoverOptions = {
        component: undefined,
        size: 'cover',
        animated: true,
        dismissOnSelect: true
    };
    onChange: (_: number) => void;
    onTouch: () => void;
    disabled: boolean;

    value = 1;

    currentMin = 1;
    currentMax = 22;

    weeks: number[];

    @Input() set min(min: number) {
        this.currentMin = min;
        this.initWeeks();
    }

    @Input() set max(max: number) {
        this.currentMax = max;
        this.initWeeks();
    }

    initWeeks() {
        this.weeks = Array((this.currentMax - this.currentMin + 1)).fill(null).map((u, i) => i + this.currentMin);
    }

    constructor() {
        this.initWeeks();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(obj: any): void {
        this.value = Number(obj);
    }

    nextWeek() {
        if (this.max && this.max < (this.value + 1)) {
            return;
        }

        this.updateValue(this.value + 1);
    }

    previousWeek() {
        if (this.min > (this.value - 1)) {
            return;
        }

        this.updateValue(this.value - 1);
    }

    updateValue(value: number) {
        if (value === this.value) {
            return;
        }
        console.log('new value :::', value);
        this.onTouch();
        this.value = value;
        this.onChange(value);
    }
}
