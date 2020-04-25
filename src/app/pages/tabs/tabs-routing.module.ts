import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import {ContactsComponent} from '../contacts/contacts.component';
import {InboxComponent} from '../inbox/inbox.component';
import {ChatBoxComponent} from '../chat-box/chat-box.component';
import {HomeComponent} from '../home/home.component';
import {CallComponent} from '../call/call.component';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'chat',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../chat/chat.module').then(m => m.ChatModule)
          }
        ]
      },
        {
            path: 'contacts',
            component: ContactsComponent
        },
        {
            path: 'inbox',
            component: InboxComponent
        },
        {
            path: 'chat-box',
            component: ChatBoxComponent
        },
        {
            path: 'home',
            component: HomeComponent
        },
        {
            path: 'call',
            component: CallComponent
        },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab2/tab2.module').then(m => m.Tab2PageModule)
          }
        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab3/tab3.module').then(m => m.Tab3PageModule)
          }
        ]
      }

    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
