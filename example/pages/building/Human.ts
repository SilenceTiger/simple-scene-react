class Human {
  name: string;
  image: any;
  position: number[];
  mesh: any 
  constructor(
    name: string,
    image: any,
    position: number[],
  ) {
    this.name = name;
    this.image = image;
    this.position = position;
  }
}

export default Human;
