// fabric-custom.d.ts
import { fabric } from 'fabric';
console.log('fabric-custom.d.ts loaded');
declare global {
    namespace fabric {
        export class CheckboxGroup extends fabric.Group {
            checkboxes: fabric.Rect[];
            buttonText: fabric.Text;
            numCheckboxes: number;
            
            constructor(options: CheckboxGroupOptions);
            
            addCheckbox(): void;
            removeCheckbox(): void;
            isCheckboxChecked(index: number): boolean;
            toggleCheckbox(index: number): void;
        }
        
        export interface CheckboxGroupOptions extends fabric.IObjectOptions {
            numCheckboxes: number;
            startLeft: number;
            startTop: number;
        }
    }
}
