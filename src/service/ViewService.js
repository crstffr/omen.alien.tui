
class ViewServiceClass {
    views = {};
    push(name, view) {
        this.views[name] = view;
    }
}

export let ViewService = new ViewServiceClass();
export let views = ViewService.views;