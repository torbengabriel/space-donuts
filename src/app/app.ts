import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { DonutList } from './donuts/donut-list/donut-list';
import { LucideShoppingCart } from '@lucide/angular';
import { Header } from './header/header';

@Component({
  imports: [RouterOutlet, NgOptimizedImage, DonutList, LucideShoppingCart, Header],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('space-donuts');
}
