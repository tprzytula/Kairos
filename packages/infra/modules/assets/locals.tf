locals {
  icons     = fileset("${path.module}/${locals.icons_path}", "*.png")
  iconsPath = "icons"
  iconsTargetPath = "assets/icons"
}
