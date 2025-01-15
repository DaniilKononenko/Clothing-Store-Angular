import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { LoginFormComponent } from './components/forms/login-form/login-form.component';
import { RegisterFormComponent } from './components/forms/register-form/register-form.component';
import { CartComponent } from './pages/cart/cart.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminProductsComponent } from './pages/admin-panel/admin-products/admin-products.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';


export const routes: Routes = [
    {path: '', redirectTo: 'products', pathMatch: 'full'},
    {path: 'products', component: ProductListComponent},
    {path: 'cart', component: CartComponent},
    {path: 'login', component: LoginFormComponent},
    {path: 'register', component: RegisterFormComponent},
    {
        path: 'admin',
        component: AdminPanelComponent,
        children: [
            {path: 'products', component: AdminProductsComponent}
        ],
        canActivate:[AdminGuard]
    },
    {path: '**', component: PageNotFoundComponent}
];
