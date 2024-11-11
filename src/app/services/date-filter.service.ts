import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateFilterService {

  constructor() { }

  filterByDate(items: any[], dateField: string) {
    let groupedItems: { date: string, items: any[], name?: string }[] = [];

    // Group items by date
    items.forEach(item => {
      let itemDate = moment(item[dateField]).format('YYYY-MM-DD');
      let index = groupedItems.findIndex(group => group.date === itemDate);

      if (index === -1) {
        groupedItems.push({
          date: itemDate,
          items: [item]
        });
      } else {
        groupedItems[index].items.push(item);
      }
    });

    // Add "Today" and "Yesterday" groups
    let today = moment().format('YYYY-MM-DD');
    let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    let todayIndex = groupedItems.findIndex(group => group.date === today);
    let yesterdayIndex = groupedItems.findIndex(group => group.date === yesterday);

    if (todayIndex !== -1) {
      groupedItems[todayIndex].name = 'Today';
    }

    if (yesterdayIndex !== -1) {
      groupedItems[yesterdayIndex].name = 'Yesterday';
    }

    // Format remaining dates
    groupedItems.forEach(group => {
      if (!group.name) {
        group.name = moment(group.date).format('ddd, MMM D');
      }
    });

    return groupedItems;
  }

}
