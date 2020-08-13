# Highlighting Time Zones in a Performant Way

Our original approach to highlighting matching timezones was to:
1. update state on match, triggering a rerender
2. Within render function, rebuild entire SVG, differentially applying bg-color styles based on match state

This approach is extremely slow because it requires us to iterate through all the timezones to rerender the SVG.  

An alternative approach that will likely work better would be to update a CSS selectorto match the polygon's we want highlighted. When we originally create the polygons we can apply a className derived from properties of the tz object like & > timezone, > pin, > country, etc.







