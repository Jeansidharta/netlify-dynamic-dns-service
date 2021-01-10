import { getMyIP } from "../../libs/ip";

export function echoIP () {
	console.log(`My IPv6 is ${getMyIP()}`);
}