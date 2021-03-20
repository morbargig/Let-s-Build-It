// import { Injectable } from '@angular/core';
// import { DynamicFormControl } from '../../../../@forms/@core/interfaces/dynamic-form-control';

// @Injectable({
//   providedIn: 'root'
// })
// export class DiscountsAndChargesFormService {

//   constructor(
//     private ancillariesGroupService: AncillariesGroupService,
//     private sideBarPageService: SideBarPageService
//   ) { }

//   generate(entity: AncillaryModel = null): DynamicFormControl[] {
//     let partnerId = this.sideBarPageService.entity.id
//     let form: DynamicFormControl[] = [];
//     form.push(
//       {
//         type: FormTextComponent,
//         config: {
//           name: 'id',
//           type: 'hidden',
//           label: 'Product ID',
//           placeholder: 'Select Product ID',
//           value: entity?.id,
//           styleClass: 'col-12',
//         },
//       },
//       {
//         type: FormSelectComponent,
//         config: {
//           name: 'ancillaryGroupId',
//           label: 'Ancillary Group Name',
//           type: 'text',
//           value: entity?.ancillaryGroupId,
//           placeholder: 'Select Ancillary Group Name',
//           optionsArr$: this.ancillariesGroupService.getAll(partnerId, { page: 1, pageSize: MAX_INT } as LazyLoadEvent).pipe(take(1), map(
//             (res) => res?.data.map(i => { return { label: i.name, value: i.id } as SelectItem })
//           )),
//           validation: [Validators.required],
//           styleClass: 'col-12',
//           errorMessages: {
//             required: 'Ancillary Group Name is required',
//           },
//         },
//       },
//       {
//         type: FormTextComponent,
//         config: {
//           name: 'title',
//           type: 'text',
//           label: 'Title',
//           value: entity?.title,
//           placeholder: 'Enter Title',
//           styleClass: 'col-12',
//           validation: [Validators.required],
//           errorMessages: {
//             required: 'Title is required',
//           },
//         },
//       },
//       {
//         type: FormTextComponent,
//         config: {
//           name: 'price',
//           label: 'Price',
//           value: entity?.price,
//           placeholder: 'Select Price',
//           styleClass: 'col-12',
//           validation: [Validators.required],
//           errorMessages: {
//             required: 'Price is required',
//           },
//         },
//       },
//       {
//         type: FormFileComponent,
//         config: {

//           name: 'documents',
//           label: 'Options',
//           value: entity?.documents,
//           placeholder: 'Import Options',
//           styleClass: 'col-12',
//           data: {
//             autoUpload: true
//           },
//           validation: [],
//           errorMessages: {},
//         },
//       },
//       {
//         type: FormTextComponent,
//         config: {
//           data: {
//             rows: 3
//           },
//           name: 'description',
//           label: 'Description',
//           value: entity?.description,
//           placeholder: 'Enter Description',
//           styleClass: 'col-12',
//           validation: [],
//           errorMessages: {},
//         },
//       },
//     );
//     return form;
//   }
// }
