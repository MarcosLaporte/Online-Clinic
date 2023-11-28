import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../classes/user';

@Pipe({
	name: 'userName'
})
export class UserNamePipe implements PipeTransform {

	transform(user: User | undefined): string {
		if (!user) return '';
		let fullname: string = '';

		if (user.role === 'specialist')
			fullname += 'Dr. ';

		fullname += `${user.firstName} ${user.lastName}`;

		return fullname;
	}

}
