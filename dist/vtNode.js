class VTNode {
    constructor(name) {
        this.values = {};
        this.children = [];
        this.name = name;
    }
    getValue(key) {
        return this.values[key];
    }
    setValue(key, value) {
        this.values[key] = value;
        return this;
    }
    getChild(name) {
        return this.children.find((child) => child.name === name);
    }
    addChild(child) {
        this.children.push(child);
    }
    getChildrenWithName(name) {
        return this.children.filter((child) => child.name === name);
    }
    getAllChildrenRecursively() {
        const children = this.children.map((child) => {
            let result = child.getAllChildrenRecursively();
            result.push(child);
            return result;
        });
        return children.flat();
    }
    getAllChildrenWithNameRecursively(name) {
        return this.getAllChildrenRecursively().filter((child) => child.name === name);
    }
    findChildWithName(name) {
        return this.getAllChildrenRecursively().find((child) => child.name === name);
    }
    clone() {
        const newNode = new VTNode(this.name);
        newNode.values = Object.assign({}, this.values);
        newNode.children = this.children.map((child) => child.clone());
        return newNode;
    }
    diff(other, chain = this.name) {
        if (other.name != this.name) {
            console.log(`${chain} [NAME] ${this.name} != ${other.name}`);
            return;
        }
        for (const key in this.values) {
            if (!(key in other.values)) {
                console.log(`${chain} [KEY] ${key} not in other`);
                continue;
            }
            const thisValue = JSON.stringify(this.values[key]);
            const otherValue = JSON.stringify(other.values[key]);
            if (thisValue !== otherValue) {
                console.log(`${chain} [VALUE] ${key} ${thisValue} != ${otherValue}`);
            }
        }
        for (let i = 0; i < this.children.length; i++) {
            const thisChild = this.children[i];
            const otherChild = other.children[i];
            if (!otherChild) {
                console.log(`${chain} [CHILD] ${thisChild.name} not in other`);
                continue;
            }
            thisChild.diff(otherChild, `${chain} -> ${thisChild.name}`);
        }
    }
}
export { VTNode };
