// import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
// import * as moment from 'moment';
//
// export class MomentDateFormatter extends NgbDateParserFormatter {
//
//     readonly DT_FORMAT = 'MM/DD/YYYY';
//
//     parse(value: string): NgbDateStruct {
//         if (value) {
//             value = value.trim();
//             const mdt = moment(value, this.DT_FORMAT);
//             if (mdt.isValid()) {
//                 return { year: mdt.year(), month: mdt.month() + 1, day: mdt.date() };
//             }
//         }
//         return null;
//     }
//     format(date: NgbDateStruct): string {
//         if (!date) { return ''; }
//         const mdt = moment([date.year, date.month - 1, date.day]);
//         if (!mdt.isValid()) { return ''; }
//         return mdt.format(this.DT_FORMAT);
//     }
// }
