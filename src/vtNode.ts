interface Vector3 {
	x: number;
	y: number;
	z: number;
}
type VTValue = string | number | boolean | Vector3 | VTValue[];

class VTNode<T extends string = string> {
	public name: string;
	public values: Record<T, VTValue> = {} as Record<T, VTValue>;
	public children: VTNode[] = [];

	constructor(name: string) {
		this.name = name;
	}

	public getValue<K extends T, Res extends VTValue>(key: K) {
		return this.values[key] as Res;
	}

	public setValue<K extends T>(key: K, value: VTValue) {
		this.values[key] = value;
		return this;
	}

	public getChild<T extends string>(name: string): VTNode<T> {
		return this.children.find((child) => child.name === name);
	}

	public addChild(child: VTNode) {
		this.children.push(child);
	}

	public getChildrenWithName(name: string) {
		return this.children.filter((child) => child.name === name);
	}

	public getAllChildrenRecursively(): VTNode[] {
		const children = this.children.map((child) => {
			let result = child.getAllChildrenRecursively();
			result.push(child);
			return result;
		});

		return children.flat();
	}

	public getAllChildrenWithNameRecursively<T extends string>(
		name: string
	): VTNode<T>[] {
		return this.getAllChildrenRecursively().filter(
			(child) => child.name === name
		) as VTNode<T>[];
	}

	public findChildWithName(name: string) {
		return this.getAllChildrenRecursively().find(
			(child) => child.name === name
		);
	}

	public clone(): VTNode<T> {
		const newNode = new VTNode(this.name);
		newNode.values = { ...this.values };
		newNode.children = this.children.map((child) => child.clone());
		return newNode;
	}

	public diff(other: VTNode<T>, chain: string = this.name) {
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
				console.log(
					`${chain} [VALUE] ${key} ${thisValue} != ${otherValue}`
				);
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

export { VTNode, Vector3, VTValue };
