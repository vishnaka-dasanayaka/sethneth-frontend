import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../../core/_services/authentication.service";
import { interval, Subscription } from "rxjs";
import { HrService } from "../../../core/_services/hr.service";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import moment from "moment";

@Component({
  selector: "app-attendance-detail",
  standalone: false,
  templateUrl: "./attendance-detail.component.html",
  styleUrl: "./attendance-detail.component.css",
})
export class AttendanceDetailComponent {
  private timerSub: Subscription | null = null;

  sysuser: any;
  LoadUI: boolean = false;

  checkedIn = false;

  hours = 0;
  minutes = 0;
  seconds = 0;

  last_checkin: any[] = [];

  durationHours: number = 0; // pass this dynamically
  maxHours: number = 10;

  progressWidth: number = 0;
  progressColor: string = "#ff820d"; // default
  isOverflow: boolean = false;

  constructor(
    private authservice: AuthenticationService,
    private hrService: HrService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.authservice.validateUser().subscribe((sysuser) => {
      this.sysuser = sysuser;
      this.getLastCheckin();
    });
  }

  getLastCheckin() {
    this.hrService.getLastCheckin().subscribe((data) => {
      if (data.status) {
        this.last_checkin = data.last_checkin;
        this.LoadUI = true;
        this.checkedIn = false;

        if (
          this.last_checkin &&
          this.last_checkin.length > 0 &&
          this.last_checkin[0].status == 0
        ) {
          this.last_checkin[0].checkin = moment(
            this.last_checkin[0].checkin,
          ).utcOffset("+05:30");
          this.checkedIn = true;
          this.startTimer();
        }
      }
    });
  }

  onCheckIn() {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const obj = {
          lat: lat,
          lng: lng,
          time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        };

        this.hrService.addCheckin(obj).subscribe((data) => {
          if (data.status) {
            if (data.checkin_status) {
              this.toastr.success("Checked in successfully", "Success", {
                positionClass: "toast-top-right",
                closeButton: true,
                timeOut: 3000,
                progressBar: true,
                toastClass: "toast toast-sm", // <-- add your small class here
              });
            } else {
              this.toastr.warning(data.err, "Warning", {
                positionClass: "toast-top-right",
                closeButton: true,
                timeOut: 3000,
                progressBar: true,
              });
            }

            this.getLastCheckin();
          } else {
            this.toastr.error(
              "Check-in failed. Contact Administration",
              "ERROR !!",
              {
                positionClass: "toast-top-right",
                closeButton: true,
              },
            );
          }
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.toastr.warning("User denied location access", "ERROR !!", {
              positionClass: "toast-top-right",
              closeButton: true,
            });
            break;
          case error.POSITION_UNAVAILABLE:
            this.toastr.error("Location unavailable", "ERROR !!", {
              positionClass: "toast-top-right",
              closeButton: true,
            });
            break;
          case error.TIMEOUT:
            this.toastr.error("Location request timed out", "ERROR !!", {
              positionClass: "toast-top-right",
              closeButton: true,
            });
            break;
        }

        // toast.error("Unable to fetch location");
      },
      {
        enableHighAccuracy: true, // better accuracy (GPS)
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }

  startTimer() {
    var lastCheckIn = new Date(this.last_checkin[0]?.checkin);
    this.timerSub = interval(0).subscribe(() => {
      if (lastCheckIn) {
        const time_now = new Date();
        const diff = time_now.getTime() - lastCheckIn.getTime();

        this.hours = Math.floor(diff / (1000 * 60 * 60));
        this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((diff % (1000 * 60)) / 1000);

        var duration = this.hours + this.minutes / 60;
        this.updateProgress(duration);

        if (duration < 6) this.progressColor = "red";
        else if (duration < 9) this.progressColor = "#ff820d";
        else this.progressColor = "green";
      }
    });
  }

  calc(checkout: any, checkin: any): string {
    if (!checkout || !checkin) return "Pending";

    const inTime = new Date(checkin).getTime();
    const outTime = new Date(checkout).getTime();

    const diffMs = outTime - inTime;

    if (diffMs <= 0) return "0h 0m";

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, "0")}h ${minutes
      .toString()
      .padStart(2, "0")}m`;
  }

  getDayName(date: any): string {
    if (!date) return "";

    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];

    const d = new Date(date);
    return days[d.getDay()];
  }

  ngOnDestroy() {
    this.timerSub?.unsubscribe();
  }

  updateProgress(duration: number, color: string = "#ff820d") {
    this.durationHours = duration;
    this.progressColor = color;

    if (duration >= this.maxHours) {
      this.progressWidth = 100;
      this.isOverflow = duration > this.maxHours;
    } else {
      this.progressWidth = (duration / this.maxHours) * 100;
      this.isOverflow = false;
    }
  }

  onFinishClick() {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    const lastCheckinTime = moment(this.last_checkin[0].checkin);
    const now = moment();

    const diffHours = now.diff(lastCheckinTime, "hours");

    const proceedCheckout = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const obj = {
            lat: lat,
            lng: lng,
            time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            checkin_id: this.last_checkin[0].id,
          };

          this.hrService.addCheckout(obj).subscribe((data) => {
            if (data.status) {
              if (data.checkin_status) {
                this.toastr.success("Checkout marked successfully", "Success", {
                  positionClass: "toast-top-right",
                  closeButton: true,
                  timeOut: 3000,
                  progressBar: true,
                  toastClass: "toast toast-sm",
                });
              } else {
                this.toastr.warning(data.err, "Warning", {
                  positionClass: "toast-top-right",
                  closeButton: true,
                  timeOut: 3000,
                  progressBar: true,
                });
              }

              this.getLastCheckin();
            } else {
              this.toastr.error(
                "Check-out failed. Contact Administration",
                "ERROR !!",
                {
                  positionClass: "toast-top-right",
                  closeButton: true,
                },
              );
            }
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.toastr.warning("User denied location access", "ERROR !!", {
                positionClass: "toast-top-right",
                closeButton: true,
              });
              break;
            case error.POSITION_UNAVAILABLE:
              this.toastr.error("Location unavailable", "ERROR !!", {
                positionClass: "toast-top-right",
                closeButton: true,
              });
              break;
            case error.TIMEOUT:
              this.toastr.error("Location request timed out", "ERROR !!", {
                positionClass: "toast-top-right",
                closeButton: true,
              });
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    };

    if (diffHours < 10) {
      swal
        .fire({
          title: "Confirm Early Checkout",
          text: `You are trying to checkout within ${diffHours} hours of check-in. Are you sure?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, proceed",
          cancelButtonText: "Cancel",
          customClass: {
            title: "swal-title-sm",
            confirmButton: "swal-confirm-sm",
            cancelButton: "swal-cancel-sm",
          },
        })
        .then((result) => {
          if (result.isConfirmed) {
            proceedCheckout();
          }
        });
    } else {
      proceedCheckout();
    }
  }
}
