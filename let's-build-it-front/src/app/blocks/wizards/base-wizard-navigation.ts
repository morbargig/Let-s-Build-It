import { Input, Directive } from '@angular/core';
import { faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';

@Directive()
export class BaseWizardNavigation {
  arrowLeft = faLongArrowAltLeft;
  arrowRight = faLongArrowAltRight;

  @Input()
  selectedIndex: number;

  @Input()
  doneUrl: string;

  @Input()
  doneText: string;

  @Input()
  isLastStep: string;
}
