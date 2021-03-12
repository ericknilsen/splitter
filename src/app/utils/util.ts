export abstract class Util {

    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser')!);
    }
}