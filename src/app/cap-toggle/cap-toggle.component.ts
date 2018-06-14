import { Component, forwardRef, Input, OnInit, ElementRef, AfterViewInit, ViewChild } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl, NgModel } from "@angular/forms";
import { Subject } from "rxjs/Subject";
import BRCapUtil from "../../brcap-util";

const noop = () => {};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CapToggleComponent),
  multi: true
};

declare var $: any;

@Component({
  selector: "cap-toggle",
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
  templateUrl: "./cap-toggle.component.html",
  styleUrls: ["./cap-toggle.component.css"]
})
export class CapToggleComponent implements ControlValueAccessor, OnInit {
  @Input("id") id: string;
  @Input("name") name: string;
  @Input("itemLabel") itemLabel: string;
  @Input("disabled") disabled: boolean;
  @Input("styleClass") styleClass: string;
  @Input("items") items: Array<any>;

  private $el: any;
  private innerValue: any = "";

  constructor(private el: ElementRef) {
    this.$el = $(el.nativeElement);
  }

  ngOnInit() {
    if (null == this.name) throw new Error("Attribute 'name' is required");
    if (!this.id) {
      this.id = BRCapUtil.guid();
    } else {
      this.id += "_toggle";
    }
  }

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  get value(): any {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  onBlur() {
    this.onTouchedCallback();
  }

  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
