locals {
  icons     = fileset("${path.module}/${locals.iconsPath}", "*.png")
  iconsPath = "icons"
  iconsTargetPath = "assets/icons"
}
