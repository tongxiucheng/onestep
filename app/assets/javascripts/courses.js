(function(){
  window.Courses = {
    watch: function(el) {
      var watched, course_user, course_name;
      course_user = $(el).data("user");
      course_name = $(el).data("course");
      watched = $(el).data("watched");
      if (watched) {
        $.ajax({
          url: "/" + course_user + "/" + course_name + "/unwatch",
          type: "POST"
        });
        $(el).data("watched", false);
        $(el).html("关注课程");
      } else {
        $.ajax({
          url: "/" + course_user + "/" + course_name + "/watch",
          type: "POST"
        });
        $(el).data("watched", true);
        $(el).html("取消关注");
      }
      return false;
    }
  }
}());
