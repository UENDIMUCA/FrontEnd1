$(document).ready(function () {
    // Function to fetch and display orders
    function loadOrders() {
        $.ajax({
            url: '../BackEnd/server.php',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response && response.length > 0) {
                    displayOrders(response);
                } else {
                    // Handle no orders or error case
                    console.log('No orders found.');
                }
            },
            error: function (xhr, status, error) {
                console.error('Error fetching orders:', error);
            }
        });
    }

    // Function to display orders in the table
    function displayOrders(orders) {
        var ordersTableBody = $("#ordersTbl tbody");
        ordersTableBody.empty();

        $.each(orders, function (index, order) {
            const newRowHtml = `<tr>
                <td>${order.fullName}</td>
                <td>${order.email}</td>
                <td>${order.phone}</td>
                <td>${order.book}</td>
                <td onclick="detectTextLanguage('${order.description}')">${order.description}</td>
                <td>
                    <button class="editBtn" data-order-id="${order.id}">Edit</button>
                    <button class="removeBtn" data-order-id="${order.id}">Remove</button>
                </td>
            </tr>`;
            ordersTableBody.append(newRowHtml);
        });
    }

    // Load orders when the page is ready
    loadOrders();

    // Attach click event for "Remove" button
    $("#ordersTbl tbody").on('click', ".removeBtn", function () {
        const orderId = $(this).data('order-id');

        // Show confirmation modal or directly remove the order
        const confirmation = confirm("Are you sure you want to remove this order?");
        if (confirmation) {
            // Call a function to handle order removal
            removeOrder(orderId);
        }
    });

    // Function to remove an order
    function removeOrder(orderId) {
        const settings = {
            async: true,
            crossDomain: true,
            url: `../BackEnd/server.php?id=${parseInt(orderId)}`,
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            }
        };

        $.ajax(settings).done(function (response) {
            console.log(response);

            // Update client-side data and UI
            const removedIndex = orders.findIndex(order => order.id === parseInt(orderId));
            if (removedIndex !== -1) {
                orders.splice(removedIndex, 1);
                displayOrders(orders);
                alert('Order removed successfully');
            }
        });
    }
});
