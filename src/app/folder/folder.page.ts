import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  Plugins,
  PushNotificationToken,
  PushNotification,
  PushNotificationActionPerformed
} from '@capacitor/core';
const {
  PushNotifications
} = Plugins;

import {
  FCM
} from '@capacitor-community/fcm';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { HttpClient } from '@angular/common/http';
const fcm = new FCM();

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  constructor(private afMessaging: AngularFireMessaging,
              private httpClient: HttpClient) {}
  ngOnInit() {
  }

  requestPushNotificationsPermissionAndToken() {
    this.afMessaging.requestToken.subscribe(token => {
      alert('Permission granted! Save to the server!' + token);
      console.log('Permission granted! Save to the server!', token);
    });
  }

  registerForPushNotificationFromAndroid() {
    PushNotifications.register();
    PushNotifications.addListener('registration', (token: PushNotificationToken) => {
      alert('Push registration success, token: ' + token.value);
      console.log('Push registration success, token: ' + token.value);
    });
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
    );
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }

  subscribeToTopicFromAndroid() {
    fcm
      .subscribeTo({ topic: 'gcdc' })
      .then((r) => alert(`subscribed to topic`))
      .catch((err) => console.log(err));
  }

  registerToken() {
    if (navigator.onLine) {
      const obj = {
        name: 'Rohit',
        token: 'The test token'
      };
      this.httpClient.post('http://localhost:8081/register', obj, {responseType: 'text'})
      .subscribe((response) => {
        alert('Registration successful');
      }, err => {
        alert('error occurred ' + err);
        console.error(err);
      });
    } else {
      navigator.serviceWorker.ready.then(registration => {
        registration.sync.register('app-register').then(() => {
          alert('Background sync enabled');
        }).catch(err => {
          alert('Could not enable background sync' + err);
          console.error('Could not enable background sync' + err);
        });
      }).catch(err => {
        alert('Error: Service worker is not ready ' + err);
        console.error(err);
      });
    }

  }

  requestForNotification() {
    // Let's check if the browser supports notifications
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return;
  } else {
    // Let's check whether notification permissions have already been granted
    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
      .then( permission => {
        // If the user accepts, let's create a notification
        if (permission === 'granted') {
          // tslint:disable-next-line: no-unused-expression
          new Notification('Hi there!');
        }
      })
      .catch(err => {
          console.log('Error in requesting for service worker notification' + err);
      });
    }
  }
}

}
