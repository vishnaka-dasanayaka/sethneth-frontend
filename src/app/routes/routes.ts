import { Routes } from "@angular/router";
import { LayoutComponent } from "../layout/layout.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "../core/_guards/auth.guards";
import { EventsModule } from "./events/events.module";
import { RegisterComponent } from "./register/register.component";
import { VerifyComponent } from "./verify/verify.component";
import { MyEventComponent } from "./events/my-event/my-event.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NewEventsComponent } from "./events/new-events/new-events.component";
import { EditedEventsComponent } from "./events/edited-events/edited-events.component";
import { ProfileComponent } from "./profile/profile.component";
import { TicketsModule } from "./tickets/tickets.module";
import { PendingEventsComponent } from "./events/pending-events/pending-events.component";
import { MyTicketsComponent } from "./tickets/my-tickets/my-tickets.component";
import { LoginRedirectGuard } from "../core/_guards/login-redirect.guard";
import { resetPasswordComponent } from "./reset-password/reset-password.component";
import { OrgernizersModule } from "./orgernizers/orgernizers.module";

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  {
    path: "",
    component: LayoutComponent,
    children: [
      //   {
      //     path: "settings",
      //     loadChildren: () =>
      //       import("./settings/settings.module").then((m) => m.SettingsModule),
      //   },
      {
        path: "tickets",
        loadChildren: () =>
          import("./tickets/tickets.module").then((m) => TicketsModule),
      },
      { path: "dashboard", component: DashboardComponent },
      { path: "profile", component: ProfileComponent },
      { path: "my-tickets", component: MyTicketsComponent },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: "home",
    component: LayoutComponent,
    loadChildren: () => import("./home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "event",
    component: LayoutComponent,
    loadChildren: () =>
      import("./events/events.module").then((m) => EventsModule),
  },
  {
    path: "orgernizers",
    component: LayoutComponent,
    loadChildren: () =>
      import("./orgernizers/orgernizers.module").then((m) => OrgernizersModule),
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [LoginRedirectGuard],
  },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [LoginRedirectGuard],
  },
  {
    path: "verify",
    component: VerifyComponent,
    canActivate: [LoginRedirectGuard],
  },
  {
    path: "reset-password",
    component: resetPasswordComponent,
    canActivate: [LoginRedirectGuard],
  },

  // Not found
  { path: "**", redirectTo: "home" },
];
