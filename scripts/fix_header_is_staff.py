path = 'artifacts/rynas-wardrobe/src/components/layout/Header.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

target = '''  const router = useRouter();

  React.useEffect(() => {
    // If logged in as staff and browsing consumer storefront routes,
    // restrict view strictly to the Atelier Management Console
    if (isStaff && pathname !== "/staff" && pathname !== "/account") {
      router.replace("/staff");
    }
  }, [isStaff, pathname, router]);

  if (pathname === "/checkout") {
    return null;
  }

  // When viewing staff portal, render strictly the Backend Atelier Console Header
  if (pathname.startsWith("/staff")) {
    return <StaffHeader user={user} logout={logout} />;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setSearchOpen(false);
    setSearchQuery("");
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const isStaff = !!(user?.isStaff || user?.isSuperuser || user?.permissions?.isStaff);'''

replacement = '''  const router = useRouter();
  const isStaff = !!(user?.isStaff || user?.isSuperuser || user?.permissions?.isStaff);

  React.useEffect(() => {
    // If logged in as staff and browsing consumer storefront routes,
    // restrict view strictly to the Atelier Management Console
    if (isStaff && pathname !== "/staff" && pathname !== "/account") {
      router.replace("/staff");
    }
  }, [isStaff, pathname, router]);

  if (pathname === "/checkout") {
    return null;
  }

  // When viewing staff portal, render strictly the Backend Atelier Console Header
  if (pathname.startsWith("/staff")) {
    return <StaffHeader user={user} logout={logout} />;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setSearchOpen(false);
    setSearchQuery("");
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };'''

assert target in text, 'Target not found'
new_text = text.replace(target, replacement, 1)
with open(path, 'w', encoding='utf-8') as f:
    f.write(new_text)
print('Moved isStaff above useEffect successfully!')

