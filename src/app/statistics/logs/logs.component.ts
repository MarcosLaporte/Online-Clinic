import { Component } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { Log } from 'src/app/environments/environment';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent {
	readonly logs: Array<Log> = [];

	constructor(private db: DatabaseService) {
		this.db.listenColChanges<Log>(
			'logs',
			this.logs,
			undefined,
			((l1: Log, l2: Log) => l1.date > l2.date ? -1 : 1),
			async log => { log.date = log.date instanceof Timestamp ? log.date.toDate() : log.date; return log; }
		);
	}
}
