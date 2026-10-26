import { Component } from '@angular/core';
import { LucideShoppingCart } from '@lucide/angular';

@Component({
  imports: [LucideShoppingCart],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {}
