$(document).ready(() => {
  const a = $("form#login"),
    b = $("input#username"),
    c = $("input#password");
  a.on("submit", (a) => {
    a.preventDefault();
    const e = { email: b.val().trim(), password: c.val().trim() };
    e.email && e.password && (d(e.email, e.password), b.val(""), c.val(""));
  });
  const d = (a, b) => {
    $.post("/api/auth/login", { email: a, password: b })
      .then(() => {
        window.location.replace(`/dashboard`);
      })
      .catch((a) => {
        console.log(a);
      });
  };
});
