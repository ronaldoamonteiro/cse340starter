<%- selectOptions.map((option)=> { %>

<option id="<% option.classification_id%>">
<%=option.classification_name%>
</option>
<% }) %>
