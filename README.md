# MunCollapse

Alternative Munin 2.x templates based on Twitter Bootstrap using collapsibles.

Based on some of the work of "Munstrap" by [Jonny McCullagh](https://github.com/jonnymccullagh), [munin-monitoring/contrib](https://github.com/munin-monitoring/contrib/tree/master/templates/munstrap) repo.

#### Overview Sample Image
<a href="sample-images/sample-home.png"><img src="sample-images/sample-home.png" style="max-width: 1229px; display:block; margin-left: auto; margin-right: auto; width: 75%" /></a>

[Semi-Live Demo](https://jtsage.dev/munin-demo/) - For the purposes of this demo only, the data is static and the zoom functionality is disabled.

---

## Installation

### 1. Clone the munin-monitoring/contrib repo to a temporary location:

```
$ cd /opt
$ git clone https://github.com/munin-monitoring/contrib.git
```

### 2. Place the template in an appropriate safe place

Ubuntu shown - other distros may prefer ```/usr/local/share/munin/...```

```
$ mkdir /usr/share/munin/template
$ mkdir /usr/share/munin/template/munstrap4
```
__NOTE__: If this step fails, your munin installation may use ```/usr/local/share/munin/...``` instead!

```
$ cp -r /opt/contrib/templates/munstrap4/templates /usr/share/munin/template/munstrap4/
$ cp -r /opt/contrib/templates/munstrap4/static /usr/share/munin/template/munstrap4/
```

### 3. Edit your ```munin.conf``` file.

Typically located at ```/etc/munin.conf```

__FIND AND CHANGE:__ (near the top of the file)

```
# Where to look for the HTML templates
#
#tmpldir        /etc/munin/templates

# Where to look for the static www files
#
#staticdir /etc/munin/static
```

__TO:__
```
# Where to look for the HTML templates
#
tmpldir /usr/share/munin/template/munstrap4/templates

# Where to look for the static www files
#
staticdir /usr/share/munin/template/munstrap4/static
```

### 4. [Optional / Recommended] Clean out the old generated files.

This isn't really required, but there will likely be orphaned files.  The location of these files can be found in your ```munin.conf``` file, with the ```htmldir``` directive.

__NOTE:__ Ubuntu shown, other distributions may be in ```/var/www/munin/```

```
$ rm -rf /var/cache/munin/www/*
```

### 5. Wait Patiently

```munin-update``` will regenerate the files the next time it runs.  By default, this is on the :05 minute tick for most installations. If you do not have new files within 10 minutes, be sure to check ```munin-update.log``` and find out what went wrong.

---

## Revert to Official Munin Template

### 1. Edit your ```munin.conf``` file.

Typically located at ```/etc/munin.conf```

__FIND AND CHANGE:__ (near the top of the file - comment these lines out!)

# Where to look for the HTML templates
#
#tmpldir /usr/share/munin/template/munstrap4/templates

# Where to look for the static www files
#
#staticdir /usr/share/munin/template/munstrap4/static

### 2. [Optional / Recommended] Clean up

Remove the files from step #1 & #2 above, and repeat step #4 & #5.

---

## Samples

#### View of a group:
<a href="sample-images/sample-group.png"><img src="sample-images/sample-group.png" style="max-width: 1229px; display:block; margin-left: auto; margin-right: auto; width: 75%" /></a>

#### View of a specific node:
<a href="sample-images/sample-node.png"><img src="sample-images/sample-node.png" style="max-width: 1229px; display:block; margin-left: auto; margin-right: auto; width: 75%" /></a>


#### Zoom feature:
<a href="sample-images/sample-zoom.png"><img src="sample-images/sample-zoom.png" style="max-width: 1229px; display:block; margin-left: auto; margin-right: auto; width: 75%" /></a>


---

## Compatibility

a/n: I am unsure of the compatibility with Munin 3. Most things will work from what I've read, but the navigation may be slightly funky.