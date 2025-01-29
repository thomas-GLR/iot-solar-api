import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReadingDevice } from '../reading-devices/reading-device.entity';

@Entity()
export class Temperature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @Column()
  collectionDate: Date;

  @ManyToOne(() => ReadingDevice, (readingDevice) => readingDevice.temperatures)
  readingDevice: ReadingDevice;

  collectionDateToDate(): number {
    return this.collectionDate.getDate();
  }

  toString(): string {
    return `id: ${this.id}, value: ${this.value}, collectionDate: ${this.collectionDateToDate()}`;
  }
}
