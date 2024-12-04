import { Component, OnInit, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  @Input() title: string;
  @Input() images: string;
  @Input() short_desc: string;
  @Input() category: string;
  @Input() quantity: number;
  @Input() price: string;
  @Input() id: number;
  @Input() onAdd: any;

  constructor() {}

  public screenWidth: any;
  public screenHeight: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  ngOnInit(): void {}
}
