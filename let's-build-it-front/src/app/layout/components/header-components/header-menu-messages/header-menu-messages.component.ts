import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../../services/messages.service';
import { Message } from '../../../models/message';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { Logger, BaseComponent } from '@core';

const logger = new Logger('HeaderMenuMessagesComponent');
@Component({
  selector: 'prx-header-menu-messages',
  templateUrl: './header-menu-messages.component.html',
  styleUrls: ['./header-menu-messages.component.scss'],
})
export class HeaderMenuMessagesComponent extends BaseComponent implements OnInit {
  protected loaded: boolean = false;

  iconClose = faTimes;
  messages: any[] = [];

  constructor(private messagesService: MessagesService) {
    super();
    this.isLoading = true;
  }

  ngOnInit() {}

  onOpenChange(status: boolean) {
    if (status && !this.loaded) {
      this.loaded = !this.loaded;

      this.messagesService
        .getLatestMessages()
        //.pipe()
        .subscribe((messages: Message[]) => {
          logger.debug('Messages', messages);
          this.isLoading = false;
          this.messages = [...messages, ...messages];
        });
    }
  }
}
