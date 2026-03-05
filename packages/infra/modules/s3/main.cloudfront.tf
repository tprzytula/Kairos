
resource "aws_cloudfront_origin_access_identity" "kairos_web_distribution" {
  comment = "kairos_web_distribution"
}

resource "aws_cloudfront_distribution" "kairos_web_distribution" {
  enabled             = true
  default_root_object = "index.html"

  # Streaming agent endpoint — no cache, forward auth header
  ordered_cache_behavior {
    path_pattern           = "/agent/stream"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "stream_agent_message"
    viewer_protocol_policy = "https-only"
    compress               = false

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0

    forwarded_values {
      query_string = false
      headers      = ["Authorization", "Content-Type", "X-Project-ID"]
      cookies {
        forward = "none"
      }
    }
  }

  # Cache behavior for static assets (long cache)
  ordered_cache_behavior {
    path_pattern           = "*.js"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = aws_s3_bucket.kairos_web_bucket.bucket
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    min_ttl     = 0
    default_ttl = 24 * 60 * 60       # 24 hours for JS files
    max_ttl     = 365 * 24 * 60 * 60 # 1 year

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  ordered_cache_behavior {
    path_pattern           = "*.css"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = aws_s3_bucket.kairos_web_bucket.bucket
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    min_ttl     = 0
    default_ttl = 24 * 60 * 60       # 24 hours for CSS files
    max_ttl     = 365 * 24 * 60 * 60 # 1 year

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  ordered_cache_behavior {
    path_pattern           = "sw.js"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = aws_s3_bucket.kairos_web_bucket.bucket
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    min_ttl     = 0
    default_ttl = 0 # Never cache service worker
    max_ttl     = 0

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  # Default behavior for HTML and other files (short cache)
  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = aws_s3_bucket.kairos_web_bucket.bucket
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    min_ttl     = 0
    default_ttl = 60      # 1 minute for HTML/manifest
    max_ttl     = 60 * 60 # 1 hour max

    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }
  }

  origin {
    domain_name = aws_s3_bucket.kairos_web_bucket.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.kairos_web_bucket.bucket

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.kairos_web_distribution.cloudfront_access_identity_path
    }
  }

  origin {
    domain_name = trimsuffix(trimprefix(var.stream_agent_message_url, "https://"), "/")
    origin_id   = "stream_agent_message"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }
}
