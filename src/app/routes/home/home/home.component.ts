import { Component, inject, OnInit, PLATFORM_ID } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { SettingsService } from "../../../core/_services/settings.service";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-home",
  standalone: false,
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent implements OnInit {
  sysuser: any;
  LoadUI: boolean = false;

  data_loaded: boolean = false;

  last_login: any;
  counts: any;
  patient_trend: any;
  order_trend: any;
  invoice_trend: any;
  inventory_value: any;

  chart_data_loaded: boolean = false;
  order_chart_data: any;
  stock_chart_data: any;
  options: any;
  platformId = inject(PLATFORM_ID);

  constructor(
    private authservice: AuthenticationService,
    private settingsService: SettingsService,
  ) {}

  ngOnInit(): void {
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.LoadUI = true;

      this.getDashboardData();
      this.getDashboardChartData();
    });
  }
  getDashboardData() {
    this.settingsService.getDashboardDate().subscribe((data) => {
      if (data.status) {
        this.data_loaded = true;
        this.last_login = data.last_login;
        this.counts = data.counts;
        this.patient_trend = data.patient_trend;
        this.order_trend = data.order_trend;
        this.invoice_trend = data.invoice_trend;
        this.inventory_value = data.inventory_value;
      }
    });
  }

  getDashboardChartData() {
    this.settingsService.getDashboardChartDate().subscribe((data) => {
      if (data.status) {
        this.chart_data_loaded = true;
        this.order_chart_data = data.order_chart_data;
        this.stock_chart_data = data.stock_chart_data;
        this.initChart();
      }
    });
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color");

      this.order_chart_data = {
        labels: this.order_chart_data.labels,
        datasets: [
          {
            data: this.order_chart_data.data,
            backgroundColor: [
              documentStyle.getPropertyValue("--p-blue-500"),
              documentStyle.getPropertyValue("--p-cyan-500"),
              documentStyle.getPropertyValue("--p-orange-500"),
              documentStyle.getPropertyValue("--p-teal-500"),
              documentStyle.getPropertyValue("--p-green-500"),
              documentStyle.getPropertyValue("--p-red-500"),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue("--p-blue-500"),
              documentStyle.getPropertyValue("--p-cyan-500"),
              documentStyle.getPropertyValue("--p-orange-500"),
              documentStyle.getPropertyValue("--p-teal-500"),
              documentStyle.getPropertyValue("--p-green-500"),
              documentStyle.getPropertyValue("--p-red-500"),
            ],
          },
        ],
      };

      this.stock_chart_data = {
        labels: this.stock_chart_data.stock_labels,
        datasets: [
          {
            data: this.stock_chart_data.stock_data,
            backgroundColor: [
              documentStyle.getPropertyValue("--p-blue-500"),
              documentStyle.getPropertyValue("--p-green-500"),
              documentStyle.getPropertyValue("--p-orange-500"),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue("--p-blue-500"),
              documentStyle.getPropertyValue("--p-green-500"),
              documentStyle.getPropertyValue("--p-orange-500"),
            ],
          },
        ],
      };

      this.options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };
    }
  }
}
